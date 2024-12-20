FROM denoland/deno:alpine-2.1.4

WORKDIR /app

USER deno

COPY . /app

RUN deno cache ./src/main.ts

ENTRYPOINT ["deno", "run", "--allow-env", "--allow-read", "--allow-write", "--allow-run", "src/main.ts"]
