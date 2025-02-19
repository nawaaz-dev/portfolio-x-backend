import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import alias from "@rollup/plugin-alias";
import tsconfigPaths from "tsconfig-paths";
import json from "@rollup/plugin-json";

const tsconfig = tsconfigPaths.loadConfig();

export default {
  input: "src/index.ts", // Entry point
  output: {
    file: "dist/index.js", // Output file
    format: "cjs", // CommonJS format
    sourcemap: true, // Generate source map for debugging
  },
  plugins: [
    alias({
      entries: Object.entries(tsconfig.paths).map(([key, value]) => ({
        find: key.replace("/*", ""),
        replacement: value[0].replace("@", "dist").replace("/*", ""),
      })),
    }),
    resolve(),
    commonjs(),
    json(),
    typescript(),
  ],
};
