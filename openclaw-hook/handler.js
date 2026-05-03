/**
 * Openclaw internal hook — Diario de Japón
 *
 * Registro en openclaw.json:
 *   "hooks": {
 *     "enabled": true,
 *     "handlers": ["./openclaw-hook/handler.js"]
 *   }
 *
 * El hook escucha message:received, procesa el contenido con OpenAI
 * y lo guarda en la API del diario.
 */

const { OpenAI }  = require('openai');
const fetch       = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
const FormData    = require('form-data');
const fs          = require('fs');
const path        = require('path');

// ─── Config ─────────────────────────────────────────────────
const DIARY_API   = process.env.DIARY_API_URL  || 'http://localhost:3001/api';
const OWNER_JID   = process.env.OWNER_JID      || '';   // e.g. "34612345678@s.whatsapp.net"
const OPENAI_KEY  = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({ apiKey: OPENAI_KEY });

// ─── Helpers ─────────────────────────────────────────────────
function today() {
  return new Date().toISOString().slice(0, 10);
}

async function postDiary(path_, body) {
  const res = await fetch(`${DIARY_API}${path_}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Diary API ${path_} → ${res.status}`);
  return res.json();
}

// ─── Detect intent ───────────────────────────────────────────
function detectCategory(text) {
  const t = text.toLowerCase();
  if (/restaurante|comida|ramen|sushi|cena|almuerzo|desayuno|café|izakaya|yakitori|tempura|menú|plato|delicioso|rico/.test(t))
    return 'restaurant';
  if (/foto|imagen|galería/.test(t))
    return 'photo';
  return 'entry';
}

// ─── Process text message ────────────────────────────────────
async function handleText(text, senderName) {
  const category = detectCategory(text);

  if (category === 'restaurant') {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `Eres el asistente escritor del diario de viaje a Japón de ${senderName}.
Extrae de este mensaje información sobre un restaurante o comida.
Responde SOLO con JSON válido, sin markdown, con estos campos:
{
  "name": "nombre del restaurante o lugar",
  "location": "dirección o barrio si se menciona",
  "city": "ciudad japonesa",
  "category": "ramen|sushi|izakaya|street|cafe|tempura|wagyu|otro",
  "rating": número del 1 al 5 (infiere del texto, default 4.5),
  "description": "descripción evocadora de 1-2 frases en español",
  "price_range": "¥|¥¥|¥¥¥"
}`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.4,
    });

    let data;
    try { data = JSON.parse(completion.choices[0].message.content); }
    catch { data = { name: text.slice(0, 60), description: text, category: 'otro', rating: 4 }; }

    return postDiary('/restaurants', data);
  }

  // Default: diary entry
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `Eres el asistente escritor del diario de viaje a Japón de ${senderName}.
Convierte este mensaje en una entrada de diario elegante, en primera persona, en español.
Responde SOLO con JSON válido, sin markdown:
{
  "title": "título poético de la entrada (máx 60 caracteres)",
  "body": "texto narrativo de 2-4 frases, evocador y personal",
  "location": "lugar en Japón si se menciona",
  "mood": "emoji + adjetivo (ej: 🌸 Maravillada)",
  "tags": ["tag1", "tag2", "tag3"]
}`,
      },
      { role: 'user', content: text },
    ],
    temperature: 0.7,
  });

  let data;
  try { data = JSON.parse(completion.choices[0].message.content); }
  catch { data = { title: text.slice(0, 60), body: text, tags: [] }; }

  return postDiary('/entries', { ...data, date: today() });
}

// ─── Process image message ───────────────────────────────────
async function handleImage(imageBuffer, mimeType, caption, senderName) {
  const base64 = imageBuffer.toString('base64');
  const dataUrl = `data:${mimeType};base64,${base64}`;

  // Ask GPT-4o to describe and categorize the image
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Eres el asistente escritor del diario de viaje a Japón de ${senderName}.
Analiza esta imagen de su viaje y responde SOLO con JSON válido, sin markdown:
{
  "type": "entry|restaurant|gallery",
  "caption": "pie de foto evocador y poético en español (máx 80 caracteres)",
  "location": "lugar en Japón si es identificable",
  "title": "título para la entrada del diario (solo si type=entry)",
  "body": "texto narrativo de 2-3 frases en primera persona (solo si type=entry)",
  "restaurant_name": "nombre del restaurante si se ve (solo si type=restaurant)",
  "category": "categoría: ramen|sushi|izakaya|street|cafe|otro (solo si type=restaurant)",
  "mood": "emoji + adjetivo (solo si type=entry)",
  "tags": ["tag1", "tag2"]
}
Si hay texto de caption del usuario, úsalo como contexto adicional.`,
      },
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: dataUrl } },
          caption ? { type: 'text', text: `Caption del usuario: ${caption}` } : null,
        ].filter(Boolean),
      },
    ],
    max_tokens: 400,
    temperature: 0.5,
  });

  let data;
  try { data = JSON.parse(completion.choices[0].message.content); }
  catch { data = { type: 'gallery', caption: caption || 'Foto de Japón' }; }

  // Save image to diary API as gallery photo first
  const formData = new FormData();
  formData.append('photo', imageBuffer, { filename: `photo_${Date.now()}.jpg`, contentType: mimeType });
  formData.append('caption', data.caption || caption || '');
  if (data.location) formData.append('location', data.location);

  const uploadRes = await fetch(`${DIARY_API}/gallery/upload`, {
    method: 'POST',
    body:   formData,
  });
  const photoRecord = await uploadRes.json();
  const photoUrl = photoRecord.url;

  if (data.type === 'restaurant') {
    return postDiary('/restaurants', {
      name:        data.restaurant_name || caption || 'Restaurante',
      location:    data.location,
      category:    data.category || 'otro',
      description: data.caption,
      photo_url:   photoUrl,
      visited_at:  new Date().toISOString(),
    });
  }

  if (data.type === 'entry') {
    return postDiary('/entries', {
      date:      today(),
      title:     data.title   || data.caption,
      body:      data.body    || data.caption,
      location:  data.location,
      mood:      data.mood,
      tags:      data.tags    || [],
      photo_url: photoUrl,
    });
  }

  // Default: just the gallery photo is enough
  return photoRecord;
}

// ─── Process audio message ───────────────────────────────────
async function handleAudio(audioBuffer, mimeType, senderName) {
  // Transcribe with Whisper
  const transcription = await openai.audio.transcriptions.create({
    file:     new File([audioBuffer], 'audio.ogg', { type: mimeType }),
    model:    'whisper-1',
    language: 'es',
  });

  const text = transcription.text;
  if (!text?.trim()) return { ok: true, message: 'Audio sin contenido transcribible' };

  // Process the transcribed text as a regular message
  return handleText(text, senderName);
}

// ─── Compose reply ───────────────────────────────────────────
function buildReply(result, type) {
  const emojis = { entry: '📖', restaurant: '🍜', gallery: '📸' };
  const typeLabel = type === 'entry' ? 'entrada del diario'
    : type === 'restaurant' ? 'restaurante'
    : 'foto en la galería';

  return `✨ ¡Listo! He añadido una nueva ${typeLabel} en tu diario de Japón.\n\n${result.title || result.name || result.caption || ''}`;
}

// ─── Main hook export ────────────────────────────────────────
/**
 * Openclaw calls this on message:received.
 * The exact signature depends on the Openclaw SDK version —
 * adjust `message` property names to match what the Gateway provides.
 */
module.exports = {
  name: 'japon-diary',
  events: ['message:received'],

  async handler(event) {
    const { message, session } = event;

    // Only process messages from the diary owner
    if (OWNER_JID && message.from !== OWNER_JID) return;

    const senderName = session?.agentName || 'Viajera';
    let result, replyType;

    try {
      if (message.type === 'text' || message.type === 'extendedText') {
        const text = message.text || message.body || '';
        if (!text.trim()) return;

        result    = await handleText(text, senderName);
        replyType = detectCategory(text) === 'restaurant' ? 'restaurant' : 'entry';

      } else if (message.type === 'image') {
        // imageBuffer should be provided by Openclaw's media downloader
        const buf = message.mediaBuffer || Buffer.from(message.mediaBase64 || '', 'base64');
        result    = await handleImage(buf, message.mimetype || 'image/jpeg', message.caption, senderName);
        replyType = result.category ? 'restaurant' : (result.body ? 'entry' : 'gallery');

      } else if (message.type === 'audio' || message.type === 'ptt') {
        const buf = message.mediaBuffer || Buffer.from(message.mediaBase64 || '', 'base64');
        result    = await handleAudio(buf, message.mimetype || 'audio/ogg', senderName);
        replyType = 'entry';

      } else {
        return; // ignore stickers, documents, etc.
      }

      // Return a reply that Openclaw will send back via WhatsApp
      return {
        reply: buildReply(result, replyType),
      };

    } catch (err) {
      console.error('[japon-diary hook] Error:', err.message);
      return {
        reply: '⚠️ Hubo un problema guardando en el diario. Inténtalo de nuevo.',
      };
    }
  },
};
