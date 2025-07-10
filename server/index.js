import express from "express";
import cors from "cors";
import multer from "multer";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import FormData from "form-data";
/* eslint-env node */

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const upload = multer({ dest: "uploads/" });
app.use(cors());

// ROUTE UTAMA UNTUK REMOVE BACKGROUND
app.post("/remove-bg", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;

  const formData = new FormData();
  formData.append("image_file", fs.createReadStream(filePath));
  formData.append("size", "auto");

  try {
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": process.env.REMOVE_BG_API_KEY, // API key kamu di .env
        },
        responseType: "arraybuffer",
      }
    );

    fs.unlinkSync(filePath); // hapus file sementara

    res.set("Content-Type", "image/png");
    res.send(Buffer.from(response.data, "binary"));
  } catch (error) {
    console.error(
      "Error hapus background:",
      error.response?.data || error.message
    );
    fs.unlinkSync(filePath); // tetap hapus file walau gagal
    res.status(500).json({ error: "Gagal hapus background" });
  }
});

app.listen(port, () => {
  console.log(`✅ Server berjalan di http://localhost:${port}`);
});
