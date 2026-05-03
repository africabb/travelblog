# Cómo registrar el hook en Openclaw

Añade esto a tu `~/.openclaw/openclaw.json`:

```json
{
  "hooks": {
    "enabled": true,
    "handlers": ["/ruta/absoluta/al/openclaw-hook/handler.js"]
  },
  "messages": {
    "inbound": {
      "debounceMs": 1200
    }
  }
}
```

Variables de entorno necesarias en el servidor de Bert:

```env
DIARY_API_URL=http://localhost:3001/api
OWNER_JID=34XXXXXXXXX@s.whatsapp.net   # tu número en formato JID de WhatsApp
OPENAI_API_KEY=sk-...
```

El hook escucha el evento `message:received` del Gateway de Openclaw.
Cuando tú (OWNER_JID) mandas un mensaje a Bert, el hook lo intercepta,
llama a OpenAI para procesarlo, y lo guarda en la API del diario.

Tipos de mensaje soportados:
- Texto → entrada del diario o restaurante (detección automática)
- Imagen → galería + entrada o restaurante según el contenido
- Audio/nota de voz → transcripción Whisper → entrada del diario
