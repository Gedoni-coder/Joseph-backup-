import sharp from "sharp";
import type { Request, Response, NextFunction } from "express";

export const compressImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Support both single and multiple files
    if (req.file) {
      // single file
      const compressedBuffer = await sharp(req.file.buffer)
        .resize(512, 512, {
          fit: "cover",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80, mozjpeg: true })
        .toBuffer();

      req.file.buffer = compressedBuffer;
      req.file.mimetype = "image/jpeg";
      req.file.originalname = "image.jpg"; // optional: you can keep original name
    } else if (req.files && Array.isArray(req.files)) {
      // multiple files
      const files = req.files as Express.Multer.File[];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        const compressedBuffer = await sharp(file.buffer)
          .resize(512, 512, {
            fit: "cover",
            withoutEnlargement: true,
          })
          .jpeg({ quality: 80, mozjpeg: true })
          .toBuffer();

        file.buffer = compressedBuffer;
        file.mimetype = "image/jpeg";
        file.originalname = `image-${i + 1}.jpg`; // optional: rename files sequentially
      }
    }

    // If no file(s), just skip
    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: "Image processing failed" });
  }
};
