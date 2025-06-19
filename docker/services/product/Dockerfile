FROM node:jod-alpine

WORKDIR /producto

# Primary app files
WORKDIR /producto/services/product
COPY services/product/ .
RUN npm i

# DB connections
WORKDIR /producto/database/productdb
COPY database/productdb .
RUN npm i

WORKDIR /producto/database/elasticsearch
COPY database/elasticsearch .
RUN npm i

# Build required tools dependencies
WORKDIR /producto/tools
COPY tools/package*.json .
RUN npm i

# Copy all tools that are needed only
COPY tools/zookeeper zookeeper
COPY tools/config    config
COPY tools/cache     cache
COPY tools/kafka     kafka

EXPOSE 8000

# Set start command
WORKDIR /producto/services/product
CMD ["npm", "run", "start"]
