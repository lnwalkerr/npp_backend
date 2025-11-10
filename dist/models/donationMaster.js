"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const utils_1 = require("../utils/utils");
const donationMasterSchema = new mongoose.Schema({
    typeOfDonation: {
        type: mongoose.Types.ObjectId,
        ref: "masterData",
        required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: Boolean, default: true },
    totalGoal: { type: Number, required: true },
    created_by: { type: mongoose.Types.ObjectId, ref: "user", required: true },
    updated_by: { type: mongoose.Types.ObjectId, ref: "user" },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
}, { id: true });
exports.default = (0, mongoose_1.model)("donationMaster", donationMasterSchema);
//# sourceMappingURL=donationMaster.js.map