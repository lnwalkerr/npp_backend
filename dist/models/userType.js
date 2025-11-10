"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const userTypeSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    created_by: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    updated_by: { type: mongoose.Types.ObjectId, ref: "user" },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
}, { id: true });
exports.default = (0, mongoose_1.model)("userType", userTypeSchema);
//# sourceMappingURL=userType.js.map