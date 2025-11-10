const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");

const joinRequestSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    constituency: { type: String, required: true },
    type: { type: String, required: true }, // volunteer, member, supporter, etc.
    experience: { type: String },
    address: { type: String },
    remarks: { type: String },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: { type: mongoose.Types.ObjectId, ref: "user" },
    reviewedAt: { type: Date },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date },
}, { id: true });

exports.default = (0, mongoose_1.model)("joinRequest", joinRequestSchema);
