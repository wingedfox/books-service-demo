# Demo project

## Prerequisites

* git 2.7
* docker 18+
* docker-compose 1.21+
* nodejs LTS

## Projects structure

* `codegen` - config and templates for openapi-based app generator
* `config` - node-config configuration files
* `docker` - docker compose related files
* `lib` - project sources
 * `services` - rest api services (partially implemented)
* `migrations` - knex migrations
 * `ddl` - pure sql migrations
* `scripts` - scripts for dockerized setup
* `spec`- openapi specification
* `webapp` - auto-generated code for openapi-backed application server

## Design Considerations

1. OpenAPI covers all data structures and preliminary checks
2. Specification allows easy stub generation from a specification with pre-defined implementation
3. Generated code checks for a live implementation in `lib/services` and falls back to stubs if no service is available
4. All services are independent from the application server and operate in terms of return values and thrown exceptions

## Run

### Development mode
Prepares all necessary resources and runs application

* `npm run prepare` - builds specification and created server stub
* `npm start` - runs application

### Testing mode
Runs applicaiton within docker container

```bash
cd docker && docker-compose up -d
```

## Test URLs
For all tests provided uuid values should be updated to existing ones

Swagger API
* http://localhost:8080/api-explorer

### Books list
```bash
curl -X GET "http://localhost:8082/v1/books?limit=2&offset=10&sort=\[\{\"field\":\"name\",\"dir\":\"asc\"\}\]&group=\[\"title\"\]" -H  "accept: application/json"
```

### Book retrieve
```bash
curl -X GET "http://localhost:8081/v1/books/30171801-04ad-4d7d-8064-b0ebf5ccd573?a=b" -H  "accept: application/json"
```

### Book create
```bash
curl -X POST "http://localhost:8082/v1/books" -d '{"title":"Test Book","date":"2001-02-12","authors":["d315c298-00d1-482d-9847-86a0e7d1f47e","72682938-2188-47c6-b2b4-a059afce235a"]}' -H 'Content-Type: application/json' -H 'Accept: application/json'
```

### Book update
```bash
curl -X PUT "http://localhost:8082/v1/books/30171801-04ad-4d7d-8064-b0ebf5ccd573" -d '{"title":"T00d1-482d-9847-86a0e7d1f47e", "72682938-2188-47c6-b2b4-a059afce235a"]}' -H 'Content-Type: application/json' -H 'Accept: application/json'
```
