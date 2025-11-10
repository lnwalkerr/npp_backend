"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const newsSchema = new mongoose.Schema({
    type: { type: String, required: true }, //healthCare education 
    title: { type: String, required: true },
    description: { type: String },
    viewCount: { type: Number, default: 0 },
    attachment: {
        url: { type: String },
        docSha: { type: String },
    },
    iconImage: {
        url: { type: String },
        docSha: { type: String },
    },
    isActive: { type: Boolean, default: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    updated_by: { type: mongoose.Types.ObjectId, ref: "user" },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date },
}, { id: true });
exports.default = (0, mongoose_1.model)("news", newsSchema);
//# sourceMappingURL=news.js.map