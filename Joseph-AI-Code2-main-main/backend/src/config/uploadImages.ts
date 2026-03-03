import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage();

// General multer upload instance
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

// --- General upload middlewares ---

// Single image upload (e.g., avatar)
export const uploadSingleImage = (fieldName: string) =>
  upload.single(fieldName);

// Multiple images upload (array of images under the same field)
export const uploadMultipleImages = (fieldName: string, maxCount = 5) =>
  upload.array(fieldName, maxCount);

// Multiple named fields (avatar + gallery etc.)
export const uploadFields = (fields: { name: string; maxCount: number }[]) =>
  upload.fields(fields);
