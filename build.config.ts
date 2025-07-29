import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  rollup: {
    emitCJS: true,
    esbuild: {
      treeShaking: true,
    },
  },
  declaration: true,
  outDir: "dist",
  clean: true,
  failOnWarn: false,
  externals: ["drizzle-orm"],
  entries: ["src/index.ts"],
});
