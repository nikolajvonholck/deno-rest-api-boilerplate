# FROM denoland/deno:alpine-1.21.1
# We use the unofficial arm64 image to support hot-reloading.
FROM lukechannings/deno:v1.21.1

EXPOSE 8000

WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following steps are re-run only when dependencies are modified).
# This should download and compile all external dependencies.
COPY deps.ts dev_deps.ts lock.json ./
COPY scripts/ ./scripts
# Download dependencies into the machine's cache, integrity checking each resource.
RUN ./scripts/reload-cache.sh

# These steps will be re-run upon each file change in your working directory:
ADD . .
# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache main.ts
ENTRYPOINT [ "/usr/bin/bash" ]
CMD [ "./scripts/run-prod.sh" ]