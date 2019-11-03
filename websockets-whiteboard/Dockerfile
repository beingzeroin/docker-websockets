FROM node:latest

RUN mkdir /beingzero-src
WORKDIR /beingzero-src

COPY . ./

RUN npm install
CMD node server.js