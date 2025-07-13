FROM node:jod-alpine

ARG PROJECT=producto
ARG NAME=api
WORKDIR /${PROJECT}

# Primary package.json
COPY package*.json ./
COPY tools/package*.json tools/
COPY services/${NAME}/package*.json services/${NAME}/
RUN npm install

# Primary app files
COPY services/${NAME} services/${NAME}

# Required tools and dependencies
COPY tools/zookeeper tools/zookeeper
COPY tools/config    tools/config

EXPOSE 8000

WORKDIR /${PROJECT}/services/${NAME}
CMD ["npm", "run", "start"]