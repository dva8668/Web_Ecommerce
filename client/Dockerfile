FROM node:slim

RUN apt-get update -y

WORKDIR /client
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "run", "start" ]