import sharp from "sharp";

export async function toThumb(data: Buffer, width = 100): Promise<Buffer> {
  return sharp(data).resize({ width }).toBuffer();
}
