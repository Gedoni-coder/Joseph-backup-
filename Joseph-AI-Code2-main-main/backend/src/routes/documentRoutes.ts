/**
 * Document Processing API Routes
 *
 * POST /documents/upload      → Upload & process a document through the full pipeline
 * GET  /documents             → List all processed documents (paginated)
 * GET  /documents/:id         → Get a single document with full extraction results
 * DELETE /documents/:id       → Delete a document record and its storage
 * GET  /documents/:id/chunks  → Retrieve vector chunks for a document
 * POST /documents/search      → Semantic search across the knowledge base
 * GET  /documents/stats       → Aggregate pipeline statistics
 */

import { Router } from "express";
import multer from "multer";
import { documentController } from "../controllers/documentController.ts";
import { authMiddleware } from "../utils/authMiddleware.ts";

const router = Router();

// Multer config: memory storage, 100 MB limit, all file types
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
    files: 20,                    // max 20 files per request
  },
  fileFilter: (_req, _file, cb) => {
    // Accept all MIME types — pipeline handles validation internally
    cb(null, true);
  },
});

// ─── Routes ──────────────────────────────────────────────────────────────────

/**
 * POST /documents/upload
 * Accepts one or more files and runs each through the full pipeline.
 * Responds with pipeline results (summary) for each file.
 */
router.post(
  "/upload",
  authMiddleware,
  upload.array("files"),
  documentController.upload,
);

/**
 * POST /documents/upload-single
 * Same as above but for a single file field named "file".
 */
router.post(
  "/upload-single",
  authMiddleware,
  upload.single("file"),
  documentController.uploadSingle,
);

/**
 * GET /documents
 * Returns paginated list of all documents for the authenticated user.
 * Query params: page, limit, category, document_type, search
 */
router.get("/", authMiddleware, documentController.list);

/**
 * GET /documents/stats
 * Returns aggregate processing statistics.
 */
router.get("/stats", authMiddleware, documentController.stats);

/**
 * GET /documents/:id
 * Returns full pipeline result for a single document.
 */
router.get("/:id", authMiddleware, documentController.getOne);

/**
 * DELETE /documents/:id
 * Removes a document record and its knowledge-base entries.
 */
router.delete("/:id", authMiddleware, documentController.remove);

/**
 * GET /documents/:id/chunks
 * Returns the vector chunks stored for a document.
 */
router.get("/:id/chunks", authMiddleware, documentController.getChunks);

/**
 * POST /documents/search
 * Semantic search query against the indexed knowledge base.
 * Body: { query: string, top_k?: number, filter?: object }
 */
router.post("/search", authMiddleware, documentController.search);

export default router;
