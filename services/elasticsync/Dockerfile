FROM node:jod-alpine

ARG PROJECT=producto
ARG NAME=elasticsync
WORKDIR /${PROJECT}

# Primary package.json
COPY package*.json .

# Primary app files
COPY services/${NAME} services/${NAME}

# DB connections
COPY database/elasticsearch database/elasticsearch

# Required tools and dependencies
COPY tools/package*.json tools/
COPY tools/config    tools/config
COPY tools/kafka     tools/kafka

RUN npm install

# Set start command
WORKDIR /producto/services/elasticsync
CMD ["npm", "run", "start"]
