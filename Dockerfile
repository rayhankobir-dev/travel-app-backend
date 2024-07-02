FROM ubuntu

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get upgrade -y

RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ./src ./src
COPY ./public ./public

RUN npm install
ENTRYPOINT [ "node", "./src/server.js" ]