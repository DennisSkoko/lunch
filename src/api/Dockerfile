FROM node:22.16-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm i
COPY . .

EXPOSE 5000
CMD [ "node", "src/main.js" ]
