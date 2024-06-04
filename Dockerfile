FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install -g npm@latest && npm cache clean --force
RUN npm install -g @nestjs/cli
RUN npm install --save-dev @types/node
RUN npm install prisma --save-dev

RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

COPY wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

COPY . .

RUN npm run build

# -------------------------------------------------------------

FROM node:20-alpine

WORKDIR /app

ARG USERNAME=appuser
ARG USER_UID=1001
ARG USER_GID=1001

RUN addgroup -g $USER_GID $USERNAME \
    && adduser -u $USER_UID -G $USERNAME -D $USERNAME \
    && apk update \
    && apk add --no-cache sudo \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    && echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME \
    && chown -R $USERNAME:$USERNAME /app \
    && chmod -R 755 /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /usr/local/bin/wait-for-postgres.sh /usr/local/bin/wait-for-postgres.sh
RUN chmod +x /usr/local/bin/wait-for-postgres.sh

EXPOSE 3001

USER appuser

ENTRYPOINT ["wait-for-postgres.sh"]

CMD ["npm", "run", "start:migrate:prod"]
