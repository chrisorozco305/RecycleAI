const express = require("express");
const { classifyImage } = require("../controllers/classifyController");
const multer = require("multer");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), classifyImage);

module.exports = router;
