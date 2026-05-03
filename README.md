# Mi Diario de Japon

Sistema completo de diario de viaje conectado a WhatsApp. Bert (tu bot) captura fotos, texto y audio y los guarda como borradores. Tu los revisas en la web privada y decides que publicar.

```
WhatsApp -> Bert (Openclaw) -> Plugin Diary -> API Fastify -> Postgres + R2
                                                                   |
                                                           Next.js Web
```

---

## Estructura del proyecto

```
japonweb/
+-- api/            # API REST -- Fastify + Postgres + R2/S3
+-- bert-plugin/    # Plugin de Openclaw -- tools de Bert
+-- web/            # Web privada + diario publico -- Next.js 14
```

---

## 1. Base de datos (Postgres)

```bash
createdb japon_diary
# Las migraciones corren automaticamente al arrancar la API
```

Tablas que crea la migracion:
- `entries`      -- entradas del diario (texto, ubicacion, estado...)
- `media`        -- fotos, videos, audios almacenados en R2/S3
- `places`       -- restaurantes, templos, tiendas...
- `entry_places` -- relacion muchos-a-muchos entre entradas y lugares

---

## 2. API (Fastify)

```bash
cd api
cp .env.example .env
# Edita .env con tus credenciales
npm install
npm start          # produccion
npm run dev        # desarrollo (node --watch)
```

Variables requeridas en `api/.env`:

| Variable | Descripcion |
|---|---|
| DATABASE_URL | URL de conexion a Postgres |
| S3_ENDPOINT | URL del endpoint R2/S3 |
| S3_BUCKET | Nombre del bucket |
| S3_ACCESS_KEY_ID | Clave de acceso |
| S3_SECRET_ACCESS_KEY | Clave secreta |
| S3_PUBLIC_URL | URL publica del bucket |
| API_SECRET | Token Bearer para autenticar el plugin y la web |
| PORT | Puerto (default: 3001) |
| ALLOWED_ORIGINS | Origenes CORS permitidos (separados por coma) |

Endpoints principales:

```
POST   /api/media/ingest          -- sube un archivo a R2 y lo registra
GET    /api/drafts                -- lista borradores
GET    /api/drafts/:id            -- detalle de borrador
PATCH  /api/drafts/:id/approve    -- marca como aprobado
PATCH  /api/drafts/:id/publish    -- publica una entrada
DELETE /api/drafts/:id            -- elimina un borrador
GET    /api/days                  -- lista fechas con actividad
GET    /api/days/:date            -- entradas y lugares de un dia
POST   /api/days/:date/publish    -- publica todas las entradas del dia
GET    /api/feed                  -- feed publico paginado
GET    /api/stats                 -- estadisticas publicas
GET    /health                    -- healthcheck
```

---

## 3. Plugin de Bert (Openclaw)

```bash
cd bert-plugin
npm install
```

En `openclaw.json` de tu servidor Bert:

```json
{
  "plugins": ["./bert-plugin/index.js"]
}
```

Variables de entorno en el servidor Bert:

| Variable | Descripcion |
|---|---|
| DIARY_API_URL | URL de la API (p.ej. https://api.tudominio.com) |
| DIARY_API_SECRET | El mismo API_SECRET de la API |

El plugin expone 8 tools a Bert:

| Tool | Cuando la usa Bert |
|---|---|
| diary_create_entry | Al recibir texto narrativo de lo que viviste |
| diary_add_media | Al recibir foto, video o audio |
| diary_add_place | Al mencionar un restaurante, templo, etc. |
| diary_list_drafts | Si pides ver tus borradores por WhatsApp |
| diary_get_day_context | Para saber que has hecho hoy |
| diary_approve_draft | Para aprobar una entrada desde WhatsApp |
| diary_publish_day | Para publicar todo un dia desde WhatsApp |
| diary_delete_draft | Para borrar un borrador desde WhatsApp |

IMPORTANTE: Bert nunca publica automaticamente. Todo se guarda como draft.
La publicacion es siempre explicita (tu la pides o lo haces en la web).

---

## 4. Web (Next.js)

```bash
cd web
cp .env.local.example .env.local
# Edita .env.local
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # produccion
```

Variables requeridas en `web/.env.local`:

| Variable | Descripcion |
|---|---|
| DIARY_API_URL | URL de la API |
| DIARY_API_SECRET | API_SECRET para llamadas server-side |
| PRIVATE_TOKEN | PIN que introduces en /login |
| MEDIA_HOSTNAME | Hostname del bucket para Image remoto |

Rutas de la web:

| Ruta | Acceso | Descripcion |
|---|---|---|
| / | publico | Redirige a /feed |
| /feed | publico | Diario publicado -- diseno japones oscuro |
| /login | publico | PIN de acceso |
| /inbox | privado | Vista rapida: stats + borradores agrupados |
| /drafts | privado | Lista de borradores con aprobar/publicar/borrar |
| /drafts/:id | privado | Detalle: fotos, texto, lugares, acciones |
| /day/:date | privado | Vista completa de un dia con todas las entradas |

Instalar como PWA en el movil:
- Safari (iOS): Compartir -> Anadir a pantalla de inicio
- Chrome (Android): Menu -> Anadir a pantalla de inicio

---

## 5. Flujo completo de uso

### Captura durante el viaje (WhatsApp)

```
Tu:   [foto del ramen] "Estoy en Ichiran en Shinjuku, el mejor ramen de mi vida"

Bert: -> diary_add_media(foto)          # guarda en R2, crea media row
      -> diary_create_entry(texto)      # crea entry como draft
      -> diary_add_place("Ichiran")     # crea place + vincula a entry

      "Guardado. He anotado tu visita a Ichiran en Shinjuku con la foto.
       Titulo: 'Ramen en Ichiran, Shinjuku'. Esta en borradores."
```

### Revision en la web (movil)

1. Abre /inbox -- ves el resumen del dia
2. Tap en un borrador -> /drafts/:id
3. Ves la foto, el texto, el lugar vinculado
4. Aprobar / Publicar / Eliminar
5. O "Publicar dia" para publicar todo de golpe

### Revision por WhatsApp

```
Tu:   "Enseñame que has guardado hoy"
Bert: -> diary_get_day_context(hoy)
      "Hoy tienes 3 entradas: el ramen de Ichiran, el Senso-ji
       y la compra en Akihabara. 2 fotos. Publico algo?"

Tu:   "Publica todo"
Bert: -> diary_publish_day(hoy)
      "Publicado. El dia 3 ya esta visible en tu diario."
```

---

## 6. Despliegue en produccion

### API en tu servidor (Podman)

Anadir al podman-compose.yml que ya usa Bert:

```yaml
services:
  japon-api:
    image: node:20-alpine
    working_dir: /app
    volumes:
      - ./api:/app
    command: sh -c "npm install && npm start"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - S3_ENDPOINT=${S3_ENDPOINT}
      - S3_BUCKET=${S3_BUCKET}
      - S3_ACCESS_KEY_ID=${S3_ACCESS_KEY_ID}
      - S3_SECRET_ACCESS_KEY=${S3_SECRET_ACCESS_KEY}
      - S3_PUBLIC_URL=${S3_PUBLIC_URL}
      - API_SECRET=${API_SECRET}
      - ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
    ports:
      - "3001:3001"
    restart: unless-stopped
```

### Web en Vercel (recomendado)

```bash
cd web
npx vercel --prod
# Anadir en Vercel Dashboard -> Environment Variables:
# DIARY_API_URL, DIARY_API_SECRET, PRIVATE_TOKEN, MEDIA_HOSTNAME
```

### Web en el mismo servidor

```bash
cd web
npm run build
PORT=3000 npm start
# O: pm2 start npm --name japon-web -- start
```

---

## 7. Cloudflare R2 -- configuracion rapida

1. Dashboard R2 -> Create bucket -> nombre: japon-diary-media
2. Settings -> Custom Domain -> anadir media.tudominio.com
3. Settings -> CORS -> anadir tu dominio de la API y web
4. API Tokens -> Create Token -> Object Read & Write

En api/.env:
```
S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
S3_BUCKET=japon-diary-media
S3_REGION=auto
S3_ACCESS_KEY_ID=<tu_access_key>
S3_SECRET_ACCESS_KEY=<tu_secret>
S3_PUBLIC_URL=https://media.tudominio.com
```

---

## 8. Iconos PWA

El SVG base esta en web/public/icon.svg. Genera los PNG:

```bash
# Con sharp (Node.js)
npm install -g sharp-cli
sharp -i web/public/icon.svg -o web/public/icon-192.png resize 192 192
sharp -i web/public/icon.svg -o web/public/icon-512.png resize 512 512

# O con Inkscape
inkscape web/public/icon.svg -w 192 -h 192 -o web/public/icon-192.png
inkscape web/public/icon.svg -w 512 -h 512 -o web/public/icon-512.png
```

---

## Stack

| Capa | Tecnologia |
|---|---|
| Bot | Openclaw + OpenAI function calling |
| API | Node.js 20 + Fastify 4 + ESM |
| Base de datos | PostgreSQL 15+ |
| Almacenamiento | Cloudflare R2 (S3-compatible) |
| Web | Next.js 14 + App Router + TypeScript + Tailwind CSS |
| Auth web | Cookie httpOnly + PIN |
| PWA | Web App Manifest + standalone mode |
