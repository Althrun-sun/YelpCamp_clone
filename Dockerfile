FROM node:18

#working Dir
WORKDIR /usr/src/app

#cpoy packages
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]