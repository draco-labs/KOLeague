FROM node:20-alpine as builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install \
  --prefer-offline \
  --non-interactive \
  --production=false

COPY . .

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app  .

EXPOSE 3000

CMD [ "yarn", "start" ]