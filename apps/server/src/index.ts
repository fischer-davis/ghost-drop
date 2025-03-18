import * as process from "node:process";
import { auth } from "@server/auth";
import registerTrpc from "@server/trpc";
import registerTusServer from "@server/tus";
import * as dotenv from "dotenv";
import fastify from "fastify";
import FastifyBetterAuth from "fastify-better-auth";

// import fp from "fastify-plugin";

dotenv.config({ path: "../../.env.development" });

const app = fastify({ logger: true });

await app.register(FastifyBetterAuth, { auth });
registerTrpc(app);
registerTusServer(app);

const port = process.env.VITE_SERVER_PORT || 3000;

app
  .listen({ port: Number(port) })
  .then(() => {
    console.log(`Server listening on port ${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
