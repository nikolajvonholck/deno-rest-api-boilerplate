./scripts/run-migrations.sh
deno run --watch --lock=lock.json --cached-only --allow-net --allow-env main.ts
