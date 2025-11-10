"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.donationController = void 0;
const customError_1 = require("../middlewares/customError");
const donation_1 = require("../models/donation");
const donationMaster_1 = require("../models/donationMaster");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
class donationController {
    /**
     * @swagger
     * /api/admin/donation/create:
     *   post:
     *     tags:
     *       - Donations
     *     summary: Create a new donation campaign
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - typeOfDonation
     *               - title
     *               - totalGoal
     *             properties:
     *               typeOfDonation:
     *                 type: string
     *                 description: ObjectId of donation type from masterData
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               totalGoal:
     *                 type: number
     *                 description: Total donation goal amount
     *     responses:
     *       200:
     *         description: Donation campaign created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static createDonationMaster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let donationMasterData = yield donationMaster_1.default.findOne({
                    typeOfDonation: req.body.typeOfDonation,
                    title: req.body.title,
                });
                if (donationMasterData) {
                    throw new customError_1.default("donationMaster already exist");
                }
                let data = yield new donationMaster_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "donationMaster Save Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    /**
     * @swagger
     * /api/admin/donation/getAll:
     *   get:
     *     tags:
     *       - Donations
     *     summary: Get all donation campaigns with optional filtering
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: typeOfDonation
     *         schema:
     *           type: string
     *         description: Filter by donation type ObjectId
     *     responses:
     *       200:
     *         description: Donation campaigns fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 totalCounts:
     *                   type: integer
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                       typeOfDonation:
     *                         type: string
     *                         description: ObjectId reference
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       totalGoal:
     *                         type: number
     *                       status:
     *                         type: boolean
     *                       created_by:
     *                         type: string
     *                         description: ObjectId reference
     *                       created_at:
     *                         type: string
     *                         format: date-time
     *                       updated_at:
     *                         type: string
     *                         format: date-time
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static getAllDonationMaster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { typeOfDonation } = req.query;
                let filter = {};
                if (typeOfDonation) {
                    filter.typeOfDonation = typeOfDonation;
                }
                const data = yield donationMaster_1.default.find(filter);
                res.json({
                    message: "donationMaster fetched successfully",
                    totalCounts: data.length,
                    data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getByIdDonationMaster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield donationMaster_1.default.findOne({
                    _id: req.query.id,
                });
                if (!data) {
                    throw new customError_1.default("donationMaster not found");
                }
                res.json({
                    message: "donationMaster Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateDonationMaster(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_by = req.admin._id;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const donationMasterData = yield donationMaster_1.default.findById(id);
                if (!donationMasterData) {
                    throw new customError_1.default("donationMaster not found");
                }
                const upDonationMaster = yield donationMaster_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upDonationMaster,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static donateByMember(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield new donation_1.default(Object.assign({}, req.body)).save();
                res.json({
                    message: "donate Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.donationController = donationController;
//# sourceMappingURL=donationController.js.map