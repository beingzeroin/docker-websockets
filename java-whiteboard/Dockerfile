# build
FROM maven

WORKDIR /usr/src/app
COPY pom.xml .
COPY . .
CMD mvn install jetty:run
