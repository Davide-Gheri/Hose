FROM node:alpine

WORKDIR /usr/src/app

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

CMD ["yarn", "start:dev"]

