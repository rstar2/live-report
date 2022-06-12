import { Readable } from "stream";

import { Controller, Get, StreamableFile, Param, Res, Req } from "@nestjs/common";
import { Response, Request } from "express";
import { AppService } from "./app.service";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getEnv(): string {
    return JSON.stringify(process.env);
  }

  @Get("videos")
  async getVideos(): Promise<any[]> {
    return this.appService.list(false);
  }

  @Get("images")
  async getImages(): Promise<any[]> {
    return this.appService.list(true);
  }

  @Get(["image/:key"])
  async getImageInfo(@Param("key") key: string): Promise<Record<string, string>> {
    return this.appService.info(key, true);
  }

  @Get("video/:key")
  async getVideoInfo(@Param("key") key: string): Promise<Record<string, string>> {
    return this.appService.info(key, false);
  }

  @Get(["images/**", "videos/**"])
  async download(
    @Req() req: Request,
    @Param("0") key: string,
    @Res({ passthrough: true }) res: Response
  ): Promise<StreamableFile> {
    // the req.params[0] or @Param("0") will match the whole "**"" in "test/**",
    // request "api/images/asd/qwe/123.txt" -> key is "asd/qwe/123.txt"
    console.log(`Download ${key}`);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const blob: Readable = await this.appService.download(key, true);

    // make the browser download the file
    res.header({
      "Content-Disposition": `attachment; filename="${key}"`,
    });
    // with piping will lose access to post-controller interceptor logic in nestjs
    // returning a StreamableFile fixes this
    //blob.pipe(res);
    return new StreamableFile(blob);
  }
}
