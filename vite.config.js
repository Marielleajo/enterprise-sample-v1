import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // To read the package.json file
import removeConsole from "vite-plugin-remove-console";

export default defineConfig(({ mode, command }) => {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const env = loadEnv(mode, __dirname);

  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "package.json"), "utf-8")
  );

  return {
    plugins: [react(), eslint(), removeConsole()],
    server: {
      open: true,
      port: parseInt(env.VITE_PORT) || 3000,
      // hmr: true,
      hot: true,
      hmr: {
        overlay: false,
      },
      https:
        command === "serve"
          ? {
              key: "./key.pem",
              cert: "./cert.pem",
            }
          : false,
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              "react",
              "react-dom",
              "highcharts",
              "highcharts-react-official",
              "axios",
              "formik",
            ],
          },
        },
      },
      target: "esnext",
      sourcemap: false,
      outDir: `build`,
      minify: "esbuild",
    },
    assetsInclude: ["**/*.xlsx"],
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __APP_VERSION__: JSON.stringify(packageJson.version),
      ...Object.keys(env).reduce((prev, key) => {
        prev[`process.env.${key}`] = JSON.stringify(env[key]);
        return prev;
      }, {}),
    },
  };
});
