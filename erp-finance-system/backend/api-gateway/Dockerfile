FROM maven:3.9.6-eclipse-temurin-21 as builder

WORKDIR /workspace

# Copy shared library and gateway sources
COPY shared-lib/pom.xml shared-lib/pom.xml
COPY shared-lib/src shared-lib/src
COPY api-gateway/pom.xml api-gateway/pom.xml
COPY api-gateway/src api-gateway/src

# Build shared library into the local Maven repository so the API gateway can resolve it
RUN mvn -f shared-lib/pom.xml clean install -DskipTests
RUN mvn -f api-gateway/pom.xml clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /workspace/api-gateway/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
