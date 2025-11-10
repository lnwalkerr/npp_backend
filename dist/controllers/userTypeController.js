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
exports.userTypeController = void 0;
const customError_1 = require("../middlewares/customError");
const userType_1 = require("../models/userType");
const mongoose = require("mongoose");
const utils_1 = require("../utils/utils");
class userTypeController {
    /**
     * @swagger
     * /api/admin/userType/create:
     *   post:
     *     tags:
     *       - User Types
     *     summary: Create a new user type
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - type
     *               - title
     *             properties:
     *               type:
     *                 type: string
     *                 example: "admin"
     *               title:
     *                 type: string
     *                 example: "Administrator"
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: User type created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static createUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userTypeData = yield userType_1.default.findOne({
                    type: req.body.type,
                });
                if (userTypeData) {
                    throw new customError_1.default("userType already exist");
                }
                let data = yield new userType_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "userType Save Successfully",
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
     * /api/admin/userType/getAll:
     *   get:
     *     tags:
     *       - User Types
     *     summary: Get all user types with optional filtering
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *         description: Filter by user type
     *     responses:
     *       200:
     *         description: User types fetched successfully
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
     *                       type:
     *                         type: string
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       created_by:
     *                         type: string
     *                         description: ObjectId reference
     *                       updated_by:
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
    static getAllUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.query;
                let filter = {};
                if (type) {
                    filter.type = type;
                }
                const data = yield userType_1.default.find(filter);
                res.json({
                    message: "userType fetched successfully",
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
    static getByIdUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield userType_1.default.findOne({
                    _id: req.query.id,
                });
                if (!data) {
                    throw new customError_1.default("UserType not found");
                }
                res.json({
                    message: "UserType Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_by = req.admin._id;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const userTypeData = yield userType_1.default.findById(id);
                if (!userTypeData) {
                    throw new customError_1.default("userType not found");
                }
                const upUserType = yield userType_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upUserType,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteUserType(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { id } = req.query;
                let data = yield userType_1.default.findOne({
                    _id: id,
                });
                if (!data) {
                    throw new customError_1.default("UserType not found");
                }
                yield userType_1.default.findOneAndDelete({ _id: id });
                res.json({
                    status_code: 200,
                    message: "Success",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.userTypeController = userTypeController;
//# sourceMappingURL=userTypeController.js.map