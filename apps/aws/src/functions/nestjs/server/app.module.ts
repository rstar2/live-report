import { join } from "path";

import { Module } from "@nestjs/common";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      // NOTE!!! It lets you create Client-Side routing for your SPA.
      // Paths, specified in your controllers will fallback to the server.
      // In other words - all paths in the controllers will be handled by the server,
      // and for all the rest the client's index.html will be returned, which makes it a perfect SPA (e.g routing can be here)
      rootPath: join(__dirname, "..", "client"),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
