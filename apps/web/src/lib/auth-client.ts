import { createAuthClient } from "better-auth/react";

const serverPort = import.meta.env.VITE_SERVER_PORT || 3000;

console.log(serverPort);

export const authClient = createAuthClient({
  baseURL: `http://localhost:${serverPort}`, // the base url of your auth server
});
