FROM node:jod-alpine

ARG PROJECT=producto
ARG NAME=api
WORKDIR /${PROJECT}

# Primary package.json
COPY package*.json .

# Primary app files
COPY services/${NAME} services/${NAME}

# Required tools and dependencies
COPY tools/package*.json tools/
COPY tools/zookeeper tools/zookeeper
COPY tools/config    tools/config

EXPOSE 8000

RUN npm install

WORKDIR /${PROJECT}/services/${NAME}
CMD ["npm", "run", "start"]