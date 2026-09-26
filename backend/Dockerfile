FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN apk add --no-cache maven
RUN mvn package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S tom && adduser -S tom -G tom
COPY --from=build /app/target/tom-backend-*.jar app.jar
RUN mkdir -p /app/uploads && chown -R tom:tom /app
USER tom
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
