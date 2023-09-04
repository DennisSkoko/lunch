FROM ghcr.io/puppeteer/puppeteer:21.1.1 

ENV NODE_ENV=production

WORKDIR /home/pptruser/app

COPY package*.json ./

RUN npm i
COPY . .

EXPOSE 5000
CMD [ "node", "src/index.js" ]
