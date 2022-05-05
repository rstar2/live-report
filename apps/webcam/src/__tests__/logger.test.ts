import log from "../logger";

describe("Logger", () => {
  it("should log on info level", () => {
    log.info("Test");
  });
});
