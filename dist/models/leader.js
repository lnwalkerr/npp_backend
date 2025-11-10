"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const leaderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
    image: {
        url: { type: String },
        docSha: { type: String },
    },
    contactInfo: {
        phone: { type: String },
        email: { type: String },
    },
    isActive: { type: Boolean, default: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    updated_by: { type: mongoose.Types.ObjectId, ref: "user" },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date },
}, { id: true });
exports.default = (0, mongoose_1.model)("leader", leaderSchema);
//# sourceMappingURL=leader.js.map