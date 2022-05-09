import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("api")
  getApiRoot(): string {
    return "root";
  }

  @Get("api/hello")
  getApiHello(): string {
    return this.appService.getHello();
  }
}
