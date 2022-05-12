import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // TODO: pass this base url
  // the default is "/" which makes resources served at root level, which is not so in my case
  // where they should be served (by nestjs) at "https://asdasd.aws.com/development/xxxxx"
  base: "/development",

  build: {
    // build into folder that will be used by the nestjs app as a static SPA folder
    outDir: "../aws/src/functions/nestjs/client/dist",
    sourcemap: "inline",
  },
});
