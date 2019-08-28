FROM node:alpine

WORKDIR /opt/app

COPY ./app/package.json package.json
COPY ./app/yarn.lock yarn.lock

RUN yarn install --prod

ENV NODE_ENV production

CMD ["node", "./build/main.js"]
