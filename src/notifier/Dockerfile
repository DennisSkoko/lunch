FROM node:18.17-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm i
COPY . .

CMD [ "node", "src/main.js" ]
