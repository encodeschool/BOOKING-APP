FROM maven:3.9.9-eclipse-temurin-17 AS builder

WORKDIR /workspace

COPY pom.xml .
COPY common-security/pom.xml common-security/pom.xml
COPY auth-service/pom.xml auth-service/pom.xml
COPY user-service/pom.xml user-service/pom.xml
COPY core-service/pom.xml core-service/pom.xml
COPY booking-service/pom.xml booking-service/pom.xml
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY config-server/pom.xml config-server/pom.xml
COPY service-registry/pom.xml service-registry/pom.xml
COPY notification-service/pom.xml notification-service/pom.xml

COPY . .

ARG SERVICE_NAME
RUN mvn -q -pl ${SERVICE_NAME} -am clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy
ARG SERVICE_NAME
WORKDIR /app
COPY ${SERVICE_NAME}/target/${SERVICE_NAME}-*.jar /app/app.jar
RUN mkdir -p /app/logs

EXPOSE 8080 8087
ENV JAVA_OPTS="-Xms256m -Xmx512m"
ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
