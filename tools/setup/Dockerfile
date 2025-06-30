FROM node:jod-slim

WORKDIR /producto

COPY package*.json .
COPY tools/package*.json tools/

COPY tools/kafka            tools/kafka
COPY database/productdb     database/productdb
COPY database/elasticsearch database/elasticsearch

COPY scripts/wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

COPY tools/setup/entrypoint.sh .
RUN chmod +x ./entrypoint.sh

RUN npm install

ENTRYPOINT ["./entrypoint.sh"]