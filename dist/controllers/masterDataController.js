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
exports.masterDataController = void 0;
const customError_1 = require("../middlewares/customError");
const masterCategory_1 = require("../models/masterCategory");
const mongoose = require("mongoose");
const masterData_1 = require("../models/masterData");
const utils_1 = require("../utils/utils");
const platform_1 = require("../models/platform");
class masterDataController {
    /**
     * @swagger
     * /master/masterCategory/create:
     *   post:
     *     tags:
     *       - Master Categories
     *     summary: Create a new master category
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - code
     *               - title
     *             properties:
     *               code:
     *                 type: string
     *                 example: "constituency"
     *               title:
     *                 type: string
     *                 example: "Constituency"
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: Master category created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    // masterCategory
    static createMasterCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let masterCategoryData = yield masterCategory_1.default.findOne({
                    code: req.body.code,
                });
                if (masterCategoryData) {
                    throw new customError_1.default("masterCategory already exist");
                }
                let data = yield new masterCategory_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "masterCategory Save Successfully",
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
     * /master/masterCategory/getAll:
     *   get:
     *     tags:
     *       - Master Categories
     *     summary: Get all master categories with optional filtering
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: code
     *         schema:
     *           type: string
     *         description: Filter by category code
     *     responses:
     *       200:
     *         description: Master categories fetched successfully
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
     *                       code:
     *                         type: string
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
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
    static getAllMasterCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code } = req.query;
                let filter = {};
                if (code) {
                    filter.code = code;
                }
                const data = yield masterCategory_1.default.find(filter);
                res.json({
                    message: "masterCategory fetched successfully",
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
    static getByIdMasterCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield masterCategory_1.default.findOne({
                    _id: req.query.id,
                });
                if (!data) {
                    throw new customError_1.default("masterCategory not found");
                }
                res.json({
                    message: "masterCategory Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getMasterDataByMasterCategoryId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield masterData_1.default.find({
                    masterCategoryId: req.query.masterCategoryId,
                });
                // Note: data is always an array, even if empty
                // Remove the check that causes the bug
                res.json({
                    message: "masterData fetched successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateMasterCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_by = req.admin._id;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const masterCategoryData = yield masterCategory_1.default.findById(id);
                if (!masterCategoryData) {
                    throw new customError_1.default("masterCategory not found");
                }
                const upMasterCategory = yield masterCategory_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upMasterCategory,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // masterData
    static createMasterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let masterDataDetails = yield masterData_1.default.findOne({
                    masterCategoryId: req.body.masterCategoryId,
                    value: req.body.value,
                });
                if (masterDataDetails) {
                    throw new customError_1.default("masterData already exist");
                }
                let data = yield new masterData_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "masterData Save Successfully",
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
     * /master/masterData/getAll:
     *   get:
     *     tags:
     *       - Master Data
     *     summary: Get all master data with optional filtering
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: code
     *         schema:
     *           type: string
     *         description: Filter by master category code
     *       - in: query
     *         name: value
     *         schema:
     *           type: string
     *         description: Filter by master data value
     *     responses:
     *       200:
     *         description: Master data fetched successfully
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
     *                       masterCategoryId:
     *                         type: string
     *                         description: ObjectId reference to master category
     *                       value:
     *                         type: string
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
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
    static getAllMasterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { code, value } = req.query;
                let filter = {};
                if (code) {
                    const category = yield masterCategory_1.default.findOne({
                        code,
                    });
                    if (!category) {
                        return res.status(400).json({ message: "master category not found" });
                    }
                    filter.masterCategoryId = category._id;
                }
                if (value) {
                    filter.value = value;
                }
                const data = yield masterData_1.default.find(filter);
                res.json({
                    message: "masterData fetched successfully",
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
    static getByIdMasterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield masterData_1.default.findOne({
                    _id: req.query.id,
                });
                if (!data) {
                    throw new customError_1.default("masterData not found");
                }
                res.json({
                    message: "masterData Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateMasterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_by = req.admin._id;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const existMasterDataData = yield masterData_1.default.findById(id);
                if (!existMasterDataData) {
                    throw new customError_1.default("masterData not found");
                }
                const upMasterData = yield masterData_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upMasterData,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // platform
    static createPlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            req.body.token = yield utils_1.Utils.encryptPassword(req.body.platformId);
            try {
                let data = yield new platform_1.default(req.body).save();
                res.json({
                    message: "Platform Save Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getAllPlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.query;
                let filter = {};
                if (name) {
                    filter.name = name;
                }
                const data = yield platform_1.default.find(filter).select("name token");
                res.json({
                    message: "platform fetched successfully",
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
    static getByIdPlatform(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield platform_1.default.findOne({
                    _id: req.query.id,
                });
                if (!data) {
                    throw new customError_1.default("platform not found");
                }
                res.json({
                    message: "platform Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updatePlatformData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const existPlatformData = yield platform_1.default.findById(id);
                if (!existPlatformData) {
                    throw new customError_1.default("platform not found");
                }
                const upPlatform = yield platform_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upPlatform,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.masterDataController = masterDataController;
//# sourceMappingURL=masterDataController.js.map