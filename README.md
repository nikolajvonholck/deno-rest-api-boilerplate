# A Deno REST API Boilerplate

test.

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
