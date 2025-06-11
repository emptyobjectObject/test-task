FROM node:20.13.1-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx nest build

CMD ["npm", "run", "start:dev"]