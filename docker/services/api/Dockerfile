FROM node:jod-alpine

WORKDIR /producto

# Primary app files
WORKDIR /producto/services/api
COPY services/api/ .
RUN npm i

# Build required tools dependencies
WORKDIR /producto/tools
COPY tools/package*.json .
RUN npm i

# Copy all tools that are needed only
COPY tools/zookeeper zookeeper
COPY tools/config    config

EXPOSE 8000

WORKDIR /producto/services/api
CMD ["npm", "run", "start"]