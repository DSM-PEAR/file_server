FROM node:12

WORKDIR /home/node/app

VOLUME ./uploads:/home/node/app/uploads

COPY . .

RUN npm install

ENV NODE_ENV production

EXPOSE 3000

CMD [ "node", "app.js" ]