FROM node:jod-slim

ARG PROJECT=producto
ARG NAME=product
WORKDIR /${PROJECT}

# Primary package.json
COPY package*.json .

# Primary app files
COPY services/${NAME} services/${NAME}

# DB connections
COPY database/productdb database/productdb
COPY database/elasticsearch database/elasticsearch

# Required tools and dependencies
COPY tools/package*.json tools/
COPY tools/zookeeper tools/zookeeper
COPY tools/config    tools/config
COPY tools/cache     tools/cache
COPY tools/kafka     tools/kafka

COPY scripts/wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

EXPOSE 8000

RUN npm install

# Set start command
WORKDIR /${PROJECT}/services/${NAME}
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["npm", "run", "start"]