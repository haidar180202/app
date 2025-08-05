FROM harbor.bukitasam.co.id/public/node:20.18-alpine3.21 AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
COPY package*.json ./

FROM base AS deploy

COPY package*.json .
COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

RUN pnpm i && \
    pnpm run build

FROM harbor.bukitasam.co.id/public/nginx:1.27.3-alpine3.20 AS nginx

RUN mkdir -p /var/www

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=deploy /app/dist /var/www

# app port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
