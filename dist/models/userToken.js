"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");
const userTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    platformId: {
        type: mongoose.Types.ObjectId,
        ref: "platform",
        required: true,
    },
    token: { type: String, required: true },
    deviceDetail: { type: String, required: true },
    data: { type: String },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
}, { id: true });
exports.default = (0, mongoose_1.model)("userToken", userTokenSchema);
//# sourceMappingURL=userToken.js.map