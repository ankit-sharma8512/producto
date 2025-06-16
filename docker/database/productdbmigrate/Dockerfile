FROM node:jod-alpine

WORKDIR /productdb_migrate

COPY database/productdb .
RUN npm i

CMD [ "npm", "run", "migrate" ]