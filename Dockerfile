FROM node:10.15-jessie as build

WORKDIR /app

RUN apt-get update -yqq
RUN apt-get install -yqq git-core

COPY package.json .
COPY package-lock.json .
COPY lerna.json .
COPY packages packages
RUN npm ci
RUN npm run bootstrap
RUN npm run build

FROM node:10.15-jessie

WORKDIR /app
COPY --from=build /app/packages/client/dist /app/packages/client/dist
COPY --from=build /app/packages/server /app/packages/server

WORKDIR /app/packages/server
CMD [ "node", "-r", "ts-node/register", "index.tsx" ]