FROM node:jod-alpine

WORKDIR /producto

# Primary app files
WORKDIR /producto/services/elasticsync
COPY services/elasticsync/ .
RUN npm i


# Build required tools dependencies
WORKDIR /producto/tools
COPY tools/package*.json .
RUN npm i

COPY tools/config    config
COPY tools/kafka     kafka

WORKDIR /producto/database/elasticsearch
COPY database/elasticsearch/package*.json .
RUN npm i

COPY database/elasticsearch .

# Set start command
WORKDIR /producto/services/elasticsync
CMD ["npm", "run", "start"]
