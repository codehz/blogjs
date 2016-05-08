FROM node:wheezy

ENV BLOGJS_CONFIG /appdata/config.json

VOLUME ["/appdata"]

ADD . /app

RUN npm install

CMD ["node", "index.js"]