FROM node:5

ADD *.json /app/
ADD src /app/src
ADD tools /app/tools
WORKDIR /app

RUN npm install

CMD npm run build
