FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash
RUN apt-get upgrade -y
RUN sudo apt install nodejs

COPY public ./public
COPY src ./src
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
ENTRYPOINT [ "node", "./src/server.js" ]