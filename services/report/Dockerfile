FROM node:jod-slim

ARG PROJECT=producto
ARG NAME=report
WORKDIR /${PROJECT}

# package.json and installs
COPY package*.json .
COPY tools/package*.json tools/
RUN npm install

# Primary app files
COPY services/${NAME} services/${NAME}

# Required tools and dependencies
COPY tools/zookeeper tools/zookeeper
COPY tools/config    tools/config

COPY scripts/wait-for-it.sh .
RUN chmod +x ./wait-for-it.sh

EXPOSE 8000

# Set start command
WORKDIR /${PROJECT}/services/${NAME}
RUN chmod +x ./entrypoint.sh
ENTRYPOINT [ "./entrypoint.sh" ]
CMD ["npm", "run", "start"]