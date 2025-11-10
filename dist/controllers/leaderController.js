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
exports.leaderController = void 0;
const customError_1 = require("../middlewares/customError");
const leader_1 = require("../models/leader");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
class leaderController {
    /**
     * @swagger
     * /api/admin/leaders/create:
     *   post:
     *     tags:
     *       - Leaders
     *     summary: Create a new leader
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - name
     *               - position
     *               - description
     *             properties:
     *               name:
     *                 type: string
     *                 description: Leader's full name
     *               position:
     *                 type: string
     *                 description: Leader's position/role
     *               description:
     *                 type: string
     *                 description: Leader's description/bio
     *               order:
     *                 type: integer
     *                 description: Display order
     *               contactInfo:
     *                 type: object
     *                 properties:
     *                   phone:
     *                     type: string
     *                   email:
     *                     type: string
     *     responses:
     *       200:
     *         description: Leader created successfully
     *       400:
     *         description: Bad request
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let leaderData = yield leader_1.default.findOne({
                    name: req.body.name,
                    position: req.body.position,
                });
                if (leaderData) {
                    throw new customError_1.default("A leader with this name and position already exists");
                }
                let data = yield new leader_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "Leader created successfully",
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
     * /api/admin/leaders/getAll:
     *   get:
     *     tags:
     *       - Leaders
     *     summary: Get all leaders with optional filtering and pagination
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: searchText
     *         schema:
     *           type: string
     *         description: Search in name or position (case insensitive)
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           default: 1
     *         description: Page number
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           default: 10
     *         description: Items per page
     *     responses:
     *       200:
     *         description: Leaders fetched successfully
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
     *                       name:
     *                         type: string
     *                       position:
     *                         type: string
     *                       description:
     *                         type: string
     *                       order:
     *                         type: integer
     *                       image:
     *                         type: object
     *                         properties:
     *                           url:
     *                             type: string
     *                           docSha:
     *                             type: string
     *                       contactInfo:
     *                         type: object
     *                         properties:
     *                           phone:
     *                             type: string
     *                           email:
     *                             type: string
     *                       created_by:
     *                         type: object
     *                         properties:
     *                           firstName:
     *                             type: string
     *                           lastName:
     *                             type: string
     *                       created_at:
     *                         type: string
     *                         format: date-time
     *                       isActive:
     *                         type: boolean
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static getAllLeaders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchText, page = 1, limit = 10 } = req.query;
                let filter = {};
                if (searchText) {
                    filter.$or = [
                        { name: { $regex: searchText, $options: "i" } },
                        { position: { $regex: searchText, $options: "i" } },
                    ];
                }
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const data = yield leader_1.default
                    .find(filter)
                    .populate({ path: "created_by", select: "firstName lastName" })
                    .sort({ order: 1, created_at: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                const totalCounts = yield leader_1.default.countDocuments(filter);
                res.json({
                    message: "Leaders fetched successfully",
                    totalCounts,
                    data,
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
     * /api/admin/leaders/getById:
     *   get:
     *     tags:
     *       - Leaders
     *     summary: Get leader by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Leader ObjectId
     *     responses:
     *       200:
     *         description: Leader fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: object
     *                   properties:
     *                     _id:
     *                       type: string
     *                     name:
     *                       type: string
     *                     position:
     *                       type: string
     *                     description:
     *                       type: string
     *                     order:
     *                       type: integer
     *                     image:
     *                       type: object
     *                       properties:
     *                         url:
     *                           type: string
     *                         docSha:
     *                           type: string
     *                     contactInfo:
     *                       type: object
     *                       properties:
     *                         phone:
     *                           type: string
     *                         email:
     *                           type: string
     *                     created_by:
     *                       type: object
     *                       properties:
     *                         firstName:
     *                           type: string
     *                         lastName:
     *                           type: string
     *                     created_at:
     *                       type: string
     *                       format: date-time
     *                     isActive:
     *                       type: boolean
     *       400:
     *         description: Leader not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static getByIdLeader(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield leader_1.default
                    .findOne({
                    _id: req.query.id,
                })
                    .populate({ path: "created_by", select: "firstName lastName" });
                if (!data) {
                    throw new customError_1.default("Leader not found");
                }
                res.json({
                    message: "Leader fetched successfully",
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
     * /api/admin/leaders/update:
     *   patch:
     *     tags:
     *       - Leaders
     *     summary: Update a leader
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Leader ObjectId
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               position:
     *                 type: string
     *               description:
     *                 type: string
     *               order:
     *                 type: integer
     *               contactInfo:
     *                 type: object
     *                 properties:
     *                   phone:
     *                     type: string
     *                   email:
     *                     type: string
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Leader updated successfully
     *       400:
     *         description: Leader not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static updateLeader(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const leaderData = yield leader_1.default.findById(id);
                if (!leaderData) {
                    throw new customError_1.default("Leader not found");
                }
                const updatedLeader = yield leader_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign(Object.assign({}, req.body), { updated_by: req.admin._id }),
                }, { new: true }).populate({ path: "created_by", select: "firstName lastName" });
                res.json({
                    status_code: 200,
                    message: "Leader updated successfully",
                    data: updatedLeader,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @swagger
     * /api/admin/leaders/delete:
     *   delete:
     *     tags:
     *       - Leaders
     *     summary: Delete a leader
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Leader ObjectId
     *     responses:
     *       200:
     *         description: Leader deleted successfully
     *       400:
     *         description: Leader not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static deleteLeader(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const leaderData = yield leader_1.default.findById(id);
                if (!leaderData) {
                    throw new customError_1.default("Leader not found");
                }
                yield leader_1.default.findByIdAndDelete(id);
                res.json({
                    status_code: 200,
                    message: "Leader deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.leaderController = leaderController;
//# sourceMappingURL=leaderController.js.map