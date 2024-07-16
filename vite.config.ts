import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, splitVendorChunkPlugin } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
// import eslint from "vite-plugin-eslint";
// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {
  const env: any = loadEnv(mode, process.cwd(), "");

  return {
    // plugins: [react(), eslint(), tsconfigPaths(), splitVendorChunkPlugin()],
    plugins: [react(), tsconfigPaths(), splitVendorChunkPlugin()],
    envPrefix: "APP_",
    server: {
      port: env?.PORT || 3000,
    },
    build: {
      outDir: path.join(__dirname, "build"),
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
          additionalData: "@root-entry-name: default;",
        },
      },
    },
  };
});
