FROM flink:1.18.1

RUN apt-get update -y
RUN apt-get install -y python3 python3-pip python3-dev && rm -rf /var/lib/apt/lists/*
RUN ln -s /usr/bin/python3 /usr/bin/python

RUN curl -L -o /opt/flink/lib/flink-sql-connector-kafka-3.2.0-1.18.jar \
    https://repo.maven.apache.org/maven2/org/apache/flink/flink-sql-connector-kafka/3.2.0-1.18/flink-sql-connector-kafka-3.2.0-1.18.jar

RUN curl -L -o /opt/flink/lib/postgresql-42.7.7.jar \
    https://jdbc.postgresql.org/download/postgresql-42.7.7.jar

RUN curl -L -o /opt/flink/lib/flink-connector-jdbc-3.1.2-1.18.jar \
    https://repo1.maven.org/maven2/org/apache/flink/flink-connector-jdbc/3.1.2-1.18/flink-connector-jdbc-3.1.2-1.18.jar

RUN pip3 install apache-flink==1.18.1

RUN mkdir -p /tmp/flink/state
RUN chown -R flink:flink /tmp/flink/state
RUN chmod -R 755 /tmp/flink/state