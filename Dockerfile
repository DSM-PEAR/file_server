FROM node:12-alpine

WORKDIR /home/node/app

COPY . .

RUN npm install

ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "app.js" ]