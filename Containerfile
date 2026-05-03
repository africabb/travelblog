FROM node:20-alpine

WORKDIR /app

# Install API dependencies
COPY server/package.json ./server/package.json
RUN cd server && npm install --omit=dev

# Install hook dependencies
COPY openclaw-hook/package.json ./openclaw-hook/package.json
RUN cd openclaw-hook && npm install --omit=dev

# Copy source
COPY server/      ./server/
COPY openclaw-hook/ ./openclaw-hook/
COPY index.html   ./public/index.html
COPY style.css    ./public/style.css
COPY app.js       ./public/app.js

# Serve static frontend from Express
RUN sed -i "s|// Serve uploaded|app.use(express.static('/app/public'));\n// Serve uploaded|" /app/server/index.js

VOLUME ["/app/server/data", "/app/server/uploads"]

ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "server/index.js"]
