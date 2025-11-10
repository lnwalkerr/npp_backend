"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const platformSchema = new mongoose.Schema({
    platformId: { type: String, required: true },
    name: { type: String, required: true },
    token: { type: String, required: true },
    softUpdate: { type: String },
    forceUpdate: { type: String },
    version: { type: String },
    data: { type: String },
    status: { type: Boolean, required: true, default: true },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
}, { id: false });
exports.default = (0, mongoose_1.model)("platform", platformSchema);
//# sourceMappingURL=platform.js.map