FROM node:7.2
MAINTAINER André Abadesso <andre@lab21k.com.br>
RUN mkdir /src
WORKDIR /src
COPY package.json /src
RUN npm install
COPY . /src/
EXPOSE 80

CMD ["npm","start"]
