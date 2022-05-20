import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";

const clientModule = ServeStaticModule.forRoot({
  // NOTE!!! It lets you create Client-Side routing for your SPA.
  // Paths, specified in your controllers will fallback to the server.
  // In other words - all paths in the controllers will be handled by the server,
  // and for all the rest the client's index.html will be returned, which makes it a perfect SPA (e.g routing can be here)
  rootPath: join(__dirname, "../client/dist"),

  // for local testing of Nestjs use this - make it depend on env variable
  serveRoot: process.env.NEST_GLOBAL_PREFIX ? process.env.NEST_GLOBAL_PREFIX : undefined,
});

export { clientModule };
