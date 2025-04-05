import { defineBuildConfig } from "unbuild";
import fs from "fs";
import path from "path";

export default defineBuildConfig({
  rollup: {
    emitCJS: true,
    esbuild: {
      treeShaking: true,
    },
  },
  declaration: true,
  outDir: "dist",
  clean: false,
  failOnWarn: false,
  externals: ["drizzle-orm", "drizzle-kit", "@electric-sql/pglite", "pg"],
  entries: [
    "src/index.ts",
    {
      input: "./src/schema/index.ts",
      outDir: "./dist/schema",
    },
    "drizzle.config.ts",
  ],
});
