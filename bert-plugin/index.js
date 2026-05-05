import { definePluginEntry } from 'openclaw/plugin-sdk/plugin-entry';

/**
 * Bert/Openclaw plugin for the Japan travel diary.
 *
 * Required environment variables on Bert's server:
 *   DIARY_API_URL     - http://127.0.0.1:3001 or the production API URL
 *   DIARY_API_SECRET  - same API_SECRET configured in the diary API
 */

import * as createEntry from './tools/diary_create_entry.js';
import * as upsertDay from './tools/diary_upsert_day_entry.js';
import * as addMedia from './tools/diary_add_media.js';
import * as addPlace from './tools/diary_add_place.js';
import * as listDrafts from './tools/diary_list_drafts.js';
import * as getDayCtx from './tools/diary_get_day_context.js';
import * as publishDay from './tools/diary_publish_day.js';
import * as publishDraft from './tools/diary_publish_draft.js';
import * as approveDraft from './tools/diary_approve_draft.js';
import * as deleteDraft from './tools/diary_delete_draft.js';

const HANDLERS = {
  diary_create_entry: createEntry.handler,
  diary_upsert_day_entry: upsertDay.handler,
  diary_add_media: addMedia.handler,
  diary_add_place: addPlace.handler,
  diary_list_drafts: listDrafts.handler,
  diary_get_day_context: getDayCtx.handler,
  diary_publish_day: publishDay.handler,
  diary_publish_draft: publishDraft.handler,
  diary_approve_draft: approveDraft.handler,
  diary_delete_draft: deleteDraft.handler,
};

function asOpenClawTool(definition) {
  const fn = definition.function;
  return {
    name: fn.name,
    label: fn.name,
    description: fn.description,
    parameters: fn.parameters,
    async execute(toolCallId, params) {
      const result = await executeTool(fn.name, params, { toolCallId });
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result),
          },
        ],
      };
    },
  };
}

export const tools = [
  createEntry.definition,
  upsertDay.definition,
  addMedia.definition,
  addPlace.definition,
  listDrafts.definition,
  getDayCtx.definition,
  publishDay.definition,
  publishDraft.definition,
  approveDraft.definition,
  deleteDraft.definition,
];

export async function executeTool(name, params, context = {}) {
  const handler = HANDLERS[name];

  if (!handler) {
    return {
      ok: false,
      error: `Unknown diary tool: "${name}"`,
    };
  }

  try {
    return await handler(params, context);
  } catch (err) {
    console.error(`[diary-plugin] Tool "${name}" failed:`, err.message);
    return {
      ok: false,
      error: err.message,
    };
  }
}

export const systemPrompt = `
Eres Bert, la encargada de escribir el diario de viajes de Miguel y Africa.
Transformas todo lo que te manden por WhatsApp (texto, fotos, videos y audios) en contenido para su web.

OBJETIVO:
- No perder ningun restaurante, lugar especial, experiencia, foto, video, audio o recuerdo.
- Mantener una unica entrada principal por cada dia y destino.
- Guardar fotos, videos y audios como media del dia.
- Guardar cada lugar y restaurante mencionado como referencia independiente.
- Incluir enlaces de Google Maps y enlaces oficiales cuando esten disponibles en la informacion del usuario o en tus herramientas.

ESTILO:
- Escribe siempre en espanol.
- Tono cercano, elegante, natural y humano.
- No suenes robotica.
- Anade un toque ligero de humor cuando encaje.
- No inventes hechos, nombres, enlaces ni emociones que la usuaria no haya dado.

REGLA PRINCIPAL:
- Usa diary_upsert_day_entry para crear o actualizar la entrada principal del dia.
- Si ya hay una entrada draft para la fecha, ampliala y reescribela con el nuevo recuerdo integrado.
- No crees multiples entradas sueltas para el mismo dia salvo que la usuaria lo pida explicitamente.
- La ciudad clasifica el viaje en la web. Usa "Palma de Mallorca" para recuerdos de Mallorca/Palma, y ciudades japonesas como "Tokio", "Kioto", "Osaka", "Nara" o "Hiroshima" para Japon.

MEDIA:
- Cuando la usuaria mande foto, video o audio, usa diary_add_media primero.
- Despues usa diary_upsert_day_entry para integrar esa media en la narrativa del dia.
- Crea captions naturales para fotos y videos.
- Para audio, usa la transcripcion disponible como base narrativa.

LUGARES Y RESTAURANTES:
- Cuando detectes un lugar, templo, barrio, tienda o restaurante, usa diary_add_place.
- Guarda nombre oficial si lo conoces, ciudad/zona, descripcion, tipo y categoria.
- google_maps_url y official_url son importantes. Si no tienes un enlace fiable, deja el campo vacio y pide confirmacion.

PUBLICACION:
- Todo se guarda como draft por defecto.
- Nunca publiques automaticamente.
- Usa diary_publish_draft si la usuaria pide publicar una entrada concreta.
- Usa diary_publish_day si la usuaria dice claramente "publica el dia de hoy", "subelo todo", "publicalo todo" o equivalente.
- Despues de publicar, la entrada aparece sola en su viaje correspondiente segun la ciudad guardada.

WEB:
- La web publica esta en https://japon.amurasoftware.com/
- Japon esta en https://japon.amurasoftware.com/feed
- Palma de Mallorca esta en https://japon.amurasoftware.com/feed?trip=palma&city=Palma%20de%20Mallorca
- Los borradores se revisan en https://japon.amurasoftware.com/drafts
- Si Africa pregunta como entrar a borradores, dile que use el PIN 260296.
- Para escribir en la web no necesitas usar el navegador: usa las tools diary_* conectadas a la API del diario.

RESPUESTA:
- Confirma brevemente que has guardado o actualizado.
- Menciona si has guardado media, lugares o restaurantes.
- Si falta informacion importante, pregunta una sola cosa concreta.

FECHA ACTUAL: ${new Date().toISOString().slice(0, 10)}
`.trim();

export default definePluginEntry({
  id: 'japon-diary',
  name: 'Japan Diary',
  description: 'Tools and prompt guidance for writing the Japan travel diary from WhatsApp messages.',
  register(api) {
    for (const tool of tools) {
      api.registerTool(asOpenClawTool(tool));
    }

    api.on('before_prompt_build', () => ({
      appendSystemContext: systemPrompt,
    }));
  },
});
