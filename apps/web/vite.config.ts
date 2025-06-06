/* eslint-env node */

import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react()],

  // TODO: pass this base url as env variable
  // the default is "/" which makes resources served at root level, which is not so in my case
  // where they should be served (by nestjs) at "https://asdasd.aws.com/development/xxxxx"
  base: "/development/",

  build: {
    // build into folder that will be used by the nestjs app as a static SPA folder
    outDir: "../backend/src/functions/nestjs/client/dist",
    sourcemap: "inline",
  },

  define: {
    __APP_ENV__: JSON.stringify("hi"),
    "process.env.WHATEVER": JSON.stringify(process.env.WHATEVER),
  },
});
