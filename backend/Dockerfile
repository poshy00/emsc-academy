FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY tsconfig.json ./
COPY src ./src

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache tini

COPY --from=builder /app/node_modules ./node_modules
COPY dist ./dist
COPY package*.json ./

EXPOSE 5000

USER node

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/server.js"]