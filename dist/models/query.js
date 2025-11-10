const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("../utils/utils");

const querySchema = new mongoose.Schema({
    constituency: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true, enum: ['low', 'medium', 'high', 'urgent'] },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    reply: { type: String },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'closed'],
        default: 'pending'
    },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date },
}, { id: true });

exports.default = (0, mongoose_1.model)("query", querySchema);
