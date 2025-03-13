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
  externals: ["drizzle-orm", "@electric-sql/pglite"],
  entries: ["index.ts"],
});
