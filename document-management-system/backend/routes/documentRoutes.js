const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const {
  uploadDocument,
  getDocuments,
  updateDocumentStatus,
  getStats,
} = require("../controllers/documentController");

router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadDocument
);

router.get(
  "/",
  authMiddleware,
  getDocuments
);

router.get(
  "/stats",
  authMiddleware,
  getStats
);

router.patch(
  "/:id/status",
  authMiddleware,
  updateDocumentStatus
);

module.exports = router;