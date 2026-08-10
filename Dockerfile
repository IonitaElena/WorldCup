FROM node:22-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build \
  && OUTPUT_DIR="$(find dist -type f -name index.html | head -n 1 | xargs dirname)" \
  && mkdir -p /app/out \
  && cp -r "$OUTPUT_DIR"/. /app/out/

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/out /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
