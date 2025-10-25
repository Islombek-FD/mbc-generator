import dotenv from "dotenv";
import fs from "fs-extra";

dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  uploadsDir: process.env.UPLOADS_DIR || "./uploads",
};

// uploads papkasini avtomatik yaratamiz
fs.ensureDirSync(config.uploadsDir);
