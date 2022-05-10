import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("api")
  getApiRoot(): string {
    return JSON.stringify(process.env);
  }

  @Get("api/videos")
  async getApiVideos(): Promise<any> {
    return this.appService.getVideos();
  }

  @Get("api/images")
  async getApiImages(): Promise<any> {
    return this.appService.getImages();
  }
}
