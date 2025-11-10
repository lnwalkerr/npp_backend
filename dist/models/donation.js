"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const utils_1 = require("../utils/utils");
const donationSchema = new mongoose.Schema({
    typeOfDonation: {
        type: mongoose.Types.ObjectId,
        ref: "masterData",
        required: true,
    }, //genralFund , campaignFund
    donationCampaign: {
        type: mongoose.Types.ObjectId,
        ref: "donationMaster",
    },
    amount: { type: Number, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    donateByExsitMember: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    created_at: { type: Date, required: true, default: utils_1.Utils.indianTimeZone },
    updated_at: { type: Date },
}, { id: true });
exports.default = (0, mongoose_1.model)("donation", donationSchema);
//# sourceMappingURL=donation.js.map