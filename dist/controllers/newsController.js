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
exports.newsController = void 0;
const customError_1 = require("../middlewares/customError");
const news_1 = require("../models/news");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
class newsController {
    /**
     * @swagger
     * /api/admin/news/create:
     *   post:
     *     tags:
     *       - News
     *     summary: Create a new news article
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
     *                 description: ObjectId of news type from masterData
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *     responses:
     *       200:
     *         description: News article created successfully
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
                let newsData = yield news_1.default.findOne({
                    title: req.body.title,
                });
                if (newsData) {
                    throw new customError_1.default("this news already exist");
                }
                let data = yield new news_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "news Save Successfully",
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
     * /api/admin/news/getAll:
     *   get:
     *     tags:
     *       - News
     *     summary: Get all news articles with optional filtering
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: type
     *         schema:
     *           type: string
     *         description: Filter by news type ObjectId
     *       - in: query
     *         name: searchText
     *         schema:
     *           type: string
     *         description: Search in title (case insensitive)
     *     responses:
     *       200:
     *         description: News articles fetched successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       _id:
     *                         type: string
     *                       type:
     *                         type: object
     *                         properties:
     *                           value:
     *                             type: string
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       viewCount:
     *                         type: integer
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
    static getAllNews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { type, searchText, page = 1, limit = 10 } = req.query;
                let filter = {};
                if (type) {
                    filter.type = type;
                }
                if (searchText) {
                    filter.$or = [
                        { title: { $regex: searchText, $options: "i" } },
                        { description: { $regex: searchText, $options: "i" } }
                    ];
                }
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const data = yield news_1.default
                    .find(filter)
                    .populate({ path: "created_by", select: "firstName lastName" })
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                const totalCounts = yield news_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalCounts / parseInt(limit));
                res.json({
                    message: "News fetched successfully",
                    totalCounts,
                    totalPages,
                    currentPage: parseInt(page),
                    data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getByIdNews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield news_1.default
                    .findOne({
                    _id: req.query.id,
                })
                    .populate({ path: "created_by", select: "firstName lastName" });
                if (!data) {
                    throw new customError_1.default("news not found");
                }
                yield news_1.default.findOneAndUpdate({
                    _id: req.query.id,
                }, {
                    $set: {
                        viewCount: data.viewCount + 1,
                    },
                });
                res.json({
                    message: "news Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateNews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const newsData = yield news_1.default.findById(id);
                if (!newsData) {
                    throw new customError_1.default("news not found");
                }
                const upNews = yield news_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upNews,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @swagger
     * /api/admin/news/delete:
     *   delete:
     *     tags:
     *       - News
     *     summary: Delete a news article
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: News article ObjectId
     *     responses:
     *       200:
     *         description: News article deleted successfully
     *       400:
     *         description: News article not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static deleteNews(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const newsData = yield news_1.default.findById(id);
                if (!newsData) {
                    throw new customError_1.default("news not found");
                }
                yield news_1.default.findByIdAndDelete(id);
                res.json({
                    status_code: 200,
                    message: "News article deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.newsController = newsController;
//# sourceMappingURL=newsController.js.map