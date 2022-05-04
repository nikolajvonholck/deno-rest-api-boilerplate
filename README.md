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
- Continuous integration workflow using GitHub Actions.
- Integrity checking of dependencies using lock file.
- Code coverage checking using Codecov.

## Environment Variables

```bash
PORT # API server port
POSTGRES_HOST # Database host
POSTGRES_PORT # Database port
POSTGRES_USER # Database username
POSTGRES_PASSWORD # Database password
POSTGRES_DB # Database name
TOKEN_SECRET # String used to derive key that signs and verifies JWT tokens.
TOKEN_EXPIRATION_SECONDS # JWT token expiration time.
```

## Scripts

The scripts are located in the directory `scripts`.

- `update-lock-file.sh` update the lock file `lock.json` with hashes of all
  dependencies.
- `reload-cache.sh` caches all dependencies while validating each one against
  the lock file `lock.json`.
- `run-migrations.sh` runs any pending migrations against the database.
- `run-seed.sh` seeds the database.
- `run-tests.sh` executes all end-to-end tests.
- `run-dev.sh` starts up the server in hot-reloading mode using the `--watch`
  flag.
- `run-prod.sh` starts up the server.

## Using This Repository as a Template

Here is a checklist if you would like to use this repository as a template for a
future project:

- [ ] Generate a new value for `TOKEN_SECRET` and configure JWT token expiry by
      updating `TOKEN_EXPIRATION_SECONDS`.
- [ ] Configure CORS in `app.ts`.
- [ ] Consider setting up Codecov for your new repository.

## Configuring Local Development Environment

Prerequisites: Docker and Docker Compose.

Create a file called `.env` by making a copy of the file `.env.example`. Next,
execute:

```shell
$ docker compose up
```

The API should then be available at `http://localhost:8000`.

## Creating New Migrations

Execute the following command to create a new migration file, replacing
`[migration-name]` with your desired migration name:

```shell
$ deno run -A --unstable https://deno.land/x/nessie/cli.ts make:migration [migration-name]
```
