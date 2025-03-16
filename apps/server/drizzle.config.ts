import { type Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./db.sqlite",
  },
  tablesFilter: ["ghost-drop_*"],
} satisfies Config;
