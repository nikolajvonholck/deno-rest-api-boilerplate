./scripts/run-migrations.sh
./scripts/run-seed.sh
deno run --watch --lock=lock.json --cached-only --allow-net --allow-env main.ts
