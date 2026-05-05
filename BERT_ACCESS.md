# Acceso de Bert para publicar

Bert no necesita acceso a GitHub ni al servidor por SSH para publicar entradas.
Solo necesita cargar el plugin `bert-plugin` y tener estas variables de entorno:

```env
DIARY_API_URL=http://127.0.0.1:3001
DIARY_API_SECRET=<mismo valor que API_SECRET en la API del diario>
```

Si Bert corre fuera del servidor, usa:

```env
DIARY_API_URL=http://204.168.146.128:3001
DIARY_API_SECRET=<mismo valor que API_SECRET en la API del diario>
```

No publiques `DIARY_API_SECRET` en chats, repositorios ni capturas. Es la llave que permite crear, editar, subir fotos y publicar entradas.

## Flujo de publicacion

1. Bert recibe textos, fotos, audios o videos por WhatsApp.
2. Bert usa `diary_add_media` para subir archivos.
3. Bert usa `diary_upsert_day_entry` para crear o actualizar el borrador del dia.
4. Bert usa `diary_add_place` para guardar restaurantes y lugares.
5. Si Africa dice "publicalo", "subelo a la web" o equivalente, Bert usa:
   - `diary_publish_draft` para publicar una entrada concreta.
   - `diary_publish_day` para publicar todo un dia.

## Clasificacion por viaje

La web clasifica las entradas por ciudad:

- `city: "Palma de Mallorca"` aparece en el viaje Palma de Mallorca.
- Cualquier otra ciudad, como `Tokio`, `Kioto`, `Osaka`, `Nara` o `Hiroshima`, aparece en Japon.

Por eso Bert debe rellenar siempre `city` cuando cree o actualice una entrada.

## Rutas utiles

- Web publica: `https://japon.amurasoftware.com/`
- Japon: `https://japon.amurasoftware.com/feed`
- Palma de Mallorca: `https://japon.amurasoftware.com/feed?trip=palma&city=Palma%20de%20Mallorca`
- Borradores: `https://japon.amurasoftware.com/drafts`

