FROM node:jod-slim

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

COPY scripts/wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

RUN npm install

# Set start command
WORKDIR /${PROJECT}/services/${NAME}
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["npm", "run", "start"]
