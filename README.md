# A Deno REST API Boilerplate

[![Continuous Integration](https://github.com/nikolajvonholck/deno-rest-api-boilerplate/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/nikolajvonholck/deno-rest-api-boilerplate)
[![Codecov](https://codecov.io/gh/nikolajvonholck/deno-rest-api-boilerplate/branch/main/graph/badge.svg)](https://codecov.io/gh/nikolajvonholck/deno-rest-api-boilerplate)

This is a boilerplate project to create a Deno REST API using `oak` and
PostgreSQL.

## Features

- Dockerfile.
- Docker Compose with PostgreSQL instance and hot-reloading.
- ORM using `denodb`.
- Migrations and seeding using `nessie`.
- CORS using `cors`.
- Request parameter validation using `zod`.
- JWT authentication using `djwt` and password hashing using `bcrypt`.
- CRUD operations with authorization for the example entity `Todo`.
- End-to-end testing for all endpoints using `superoak`.
- Continuos integration workflow using GitHub Actions.
- Integrity checking of dependencies using lock file.
- Code coverage checking using Codecov.

## Environment Variables

```bash
PORT # Server port
POSTGRES_HOST # Database host
POSTGRES_PORT # Database port
POSTGRES_USER # Database username
POSTGRES_PASSWORD # Database password
POSTGRES_DB # Database name
TOKEN_SECRET # String used to derive key that signs and verifies JWT tokens.
TOKEN_EXPIRATION_SECONDS # JWT token expiration time.
```

## Scripts

TODO

## Using This Repository as a Template

TODO: CORS, generate jwt key, codecov.

## Configuring Local Development Environment

TODO.

## Old stuff

To run:

```shell
deno run --allow-net --allow-env index.ts
```

To create new migration file:

```shell
$ deno run -A --unstable https://deno.land/x/nessie/cli.ts make:migration create_todos
```

To perform migrations:

```shell
$ deno run -A --unstable https://deno.land/x/nessie/cli.ts migrate
```
