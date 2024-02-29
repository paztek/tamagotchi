# Build
FROM node:18-alpine3.19 as builder

RUN apk --no-cache --virtual build-dependencies add python3 make g++

## Add the wait script to the image
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

WORKDIR /build

COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./

RUN npm config set cache /tmp/cache --location=global && \
    npm ci --no-scripts

RUN npm run build

# Run
FROM node:18-alpine3.19

ENV NODE_ENV=production

WORKDIR /app

COPY package.json package-lock.json ./
COPY --from=builder /build/dist dist

CMD /wait && npm run start:prod
