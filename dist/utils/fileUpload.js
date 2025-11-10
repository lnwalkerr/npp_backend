"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.getPresignedUrl = exports.fileUpload = exports.upload = void 0;
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
// =====================
// ⚙️ CONFIGURATION
// =====================
// Local upload directory
const localDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
}
// Multer configuration (works for both local & S3)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, localDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    },
});
exports.upload = multer({ storage });
// =====================
// ☁️ AWS S3 CONFIG
// =====================
const s3 = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// =====================
// 📤 UPLOAD FUNCTION
// =====================
/**
 * Upload file (supports "local" or "s3" modes)
 * @param {object} file - Multer file object
 * @param {"local"|"s3"} mode - Storage mode
 * @returns {Promise<{ url: string, key?: string }>}
 */
const fileUpload = (file_1, ...args_1) => __awaiter(void 0, [file_1, ...args_1], void 0, function* (file, mode = "local") {
    if (!file)
        throw new Error("No file provided");
    if (mode === "s3") {
        const fileKey = `uploads/${Date.now()}-${file.originalname}`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: fileKey,
            Body: fs.createReadStream(file.path),
            ContentType: file.mimetype,
        };
        yield s3.send(new client_s3_1.PutObjectCommand(uploadParams));
        // Optional: remove local temp file after upload
        fs.unlinkSync(file.path);
        const fileUrl = `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
        return { url: fileUrl, key: fileKey };
    }
    // Default local storage
    const localUrl = `/uploads/${file.filename}`;
    return { url: localUrl };
});
exports.fileUpload = fileUpload;
// =====================
// 🔗 PRESIGNED URL (optional, for S3)
// =====================
/**
 * Generate presigned URL for accessing S3 file
 * @param {string} key - S3 object key
 * @param {number} expiresIn - Expiration in seconds (default: 3600)
 */
const getPresignedUrl = (key_1, ...args_1) => __awaiter(void 0, [key_1, ...args_1], void 0, function* (key, expiresIn = 3600) {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key,
    });
    return yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn });
});
exports.getPresignedUrl = getPresignedUrl;
// =====================
// 🗑️ DELETE FUNCTION
// =====================
/**
 * Delete file (supports "local" or "s3" modes)
 * @param {string} identifier - local path or S3 key
 * @param {"local"|"s3"} mode
 */
const deleteFile = (identifier_1, ...args_1) => __awaiter(void 0, [identifier_1, ...args_1], void 0, function* (identifier, mode = "local") {
    if (!identifier)
        throw new Error("No file identifier provided");
    if (mode === "s3") {
        const deleteParams = {
            Bucket: process.env.AWS_BUCKET,
            Key: identifier,
        };
        yield s3.send(new client_s3_1.DeleteObjectCommand(deleteParams));
        return true;
    }
    // Local delete
    const filePath = path.join(process.cwd(), identifier.replace("/uploads/", "uploads/"));
    if (fs.existsSync(filePath))
        fs.unlinkSync(filePath);
    return true;
});
exports.deleteFile = deleteFile;
//# sourceMappingURL=fileUpload.js.map