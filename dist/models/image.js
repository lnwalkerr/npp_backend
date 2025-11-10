"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const imageItemSchema = new mongoose.Schema({
    url: { type: String, required: true },
    setAsCover: { type: Boolean, default: false },
}, { _id: true } // ✅ ensures each image has its own _id
);
const imageSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: { type: [imageItemSchema], required: true },
    created_at: {
        type: Date,
        required: true,
        default: () => utils_1.Utils.indianTimeZone(),
    },
    updated_at: { type: Date },
}, { id: true });
exports.default = (0, mongoose_1.model)("Image", imageSchema);
//# sourceMappingURL=image.js.map