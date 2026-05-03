/**
 * Plugin de Bert/Openclaw — Diario de Japón
 *
 * Registra las tools del diario en el agente.
 * Openclaw carga este archivo como plugin y expone las tools a Bert.
 *
 * Configuración en openclaw.json:
 * {
 *   "plugins": ["./bert-plugin/index.js"]
 * }
 *
 * Variables de entorno requeridas en el servidor de Bert:
 *   DIARY_API_URL     — http://localhost:3001  (o la URL de producción)
 *   DIARY_API_SECRET  — el mismo API_SECRET que configuraste en la API
 */

import * as createEntry  from './tools/diary_create_entry.js';
import * as addMedia     from './tools/diary_add_media.js';
import * as addPlace     from './tools/diary_add_place.js';
import * as listDrafts   from './tools/diary_list_drafts.js';
import * as getDayCtx    from './tools/diary_get_day_context.js';
import * as publishDay   from './tools/diary_publish_day.js';
import * as approveDraft from './tools/diary_approve_draft.js';
import * as deleteDraft  from './tools/diary_delete_draft.js';

// Mapa name → handler para el dispatcher
const HANDLERS = {
  diary_create_entry:    createEntry.handler,
  diary_add_media:       addMedia.handler,
  diary_add_place:       addPlace.handler,
  diary_list_drafts:     listDrafts.handler,
  diary_get_day_context: getDayCtx.handler,
  diary_publish_day:     publishDay.handler,
  diary_approve_draft:   approveDraft.handler,
  diary_delete_draft:    deleteDraft.handler,
};

// Definiciones en formato OpenAI tool calling (que Openclaw/Bert consume)
export const tools = [
  createEntry.definition,
  addMedia.definition,
  addPlace.definition,
  listDrafts.definition,
  getDayCtx.definition,
  publishDay.definition,
  approveDraft.definition,
  deleteDraft.definition,
];

/**
 * Ejecuta una tool por nombre.
 * Openclaw llama a esta función cuando Bert decide usar una tool.
 *
 * @param {string} name       — nombre de la tool
 * @param {object} params     — argumentos parseados por el LLM
 * @param {object} [context]  — contexto del mensaje (messageId, timestamp, session…)
 * @returns {Promise<object>} — resultado que se devuelve al LLM como tool_result
 */
export async function executeTool(name, params, context = {}) {
  const handler = HANDLERS[name];

  if (!handler) {
    return {
      ok:    false,
      error: `Tool desconocida: "${name}"`,
    };
  }

  try {
    return await handler(params, context);
  } catch (err) {
    console.error(`[diary-plugin] Tool "${name}" falló:`, err.message);
    return {
      ok:    false,
      error: err.message,
    };
  }
}

/**
 * Sistema de prompt que se inyecta en el contexto de Bert.
 * Define cuándo y cómo usar cada tool.
 */
export const systemPrompt = `
Eres Bert, el asistente de viaje personal de la usuaria durante su viaje a Japón.
Tu rol principal es escuchar lo que vive, capturarlo en su diario y ayudarla a revisarlo.

REGLAS DE CAPTURA:
- Cuando la usuaria mande texto describiendo algo que vivió → diary_create_entry
- Cuando mande una foto, vídeo o audio → diary_add_media (siempre primero)
  - Si el mensaje tiene también texto narrativo → diary_create_entry y vincula el media_id
- Cuando mencione un restaurante, templo u otro lugar → diary_add_place
- Vincula siempre los lugares a la entrada correspondiente si existe

REGLAS DE BORRADORES:
- Todo se guarda como draft por defecto
- NUNCA publiques automáticamente sin que la usuaria lo pida explícitamente
- Palabras que indican publicar: "publícalo", "que salga en el diario", "ya está listo"
- Palabras que indican revisar: "enséñame", "qué has guardado", "léeme", "resúmeme"

REGLAS DE RESPUESTA:
- Confirma siempre brevemente lo que acabas de guardar
- Si guardaste una foto: menciona que está en la galería
- Si guardaste una entrada: menciona el título que le pusiste
- Si hay borradores pendientes al final del día, recuérdalo
- Responde siempre en español, tono cercano y de acompañante de viaje

FECHA ACTUAL: ${new Date().toISOString().slice(0, 10)}
`.trim();

export default { tools, executeTool, systemPrompt };
