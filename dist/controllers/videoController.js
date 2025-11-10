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
exports.videoController = void 0;
const customError_1 = require("../middlewares/customError");
const video_1 = require("../models/video");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
class videoController {
    /**
     * @swagger
     * /api/admin/videos/create:
     *   post:
     *     tags:
     *       - Videos
     *     summary: Create a new video
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - description
     *               - videoUrl
     *             properties:
     *               title:
     *                 type: string
     *                 description: Video title
     *               description:
     *                 type: string
     *                 description: Video description
     *               videoUrl:
     *                 type: string
     *                 description: Video URL or embed link
     *               thumbnailUrl:
     *                 type: string
     *                 description: Thumbnail image URL
     *               duration:
     *                 type: string
     *                 description: Video duration (e.g., "10:30")
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *                 description: Video tags
     *     responses:
     *       200:
     *         description: Video created successfully
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
                let videoData = yield video_1.default.findOne({
                    title: req.body.title,
                    videoUrl: req.body.videoUrl,
                });
                if (videoData) {
                    throw new customError_1.default("A video with this title and URL already exists");
                }
                let data = yield new video_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "Video created successfully",
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
     * /api/admin/videos/getAll:
     *   get:
     *     tags:
     *       - Videos
     *     summary: Get all videos with optional filtering and pagination
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: searchText
     *         schema:
     *           type: string
     *         description: Search in title (case insensitive)
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
     *         description: Videos fetched successfully
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
     *                       title:
     *                         type: string
     *                       description:
     *                         type: string
     *                       videoUrl:
     *                         type: string
     *                       thumbnailUrl:
     *                         type: string
     *                       duration:
     *                         type: string
     *                       views:
     *                         type: integer
     *                       tags:
     *                         type: array
     *                         items:
     *                           type: string
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
    static getAllVideos(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchText, page = 1, limit = 10 } = req.query;
                let filter = {};
                if (searchText) {
                    filter.title = { $regex: searchText, $options: "i" };
                }
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const data = yield video_1.default
                    .find(filter)
                    .populate({ path: "created_by", select: "firstName lastName" })
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                const totalCounts = yield video_1.default.countDocuments(filter);
                res.json({
                    message: "Videos fetched successfully",
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
     * /api/admin/videos/getById:
     *   get:
     *     tags:
     *       - Videos
     *     summary: Get video by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Video ObjectId
     *     responses:
     *       200:
     *         description: Video fetched successfully
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
     *                     title:
     *                       type: string
     *                     description:
     *                       type: string
     *                     videoUrl:
     *                       type: string
     *                     thumbnailUrl:
     *                       type: string
     *                     duration:
     *                       type: string
     *                     views:
     *                       type: integer
     *                     tags:
     *                       type: array
     *                       items:
     *                         type: string
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
     *         description: Video not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static getByIdVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield video_1.default
                    .findOne({
                    _id: req.query.id,
                })
                    .populate({ path: "created_by", select: "firstName lastName" });
                if (!data) {
                    throw new customError_1.default("Video not found");
                }
                // Increment view count
                yield video_1.default.findOneAndUpdate({
                    _id: req.query.id,
                }, {
                    $inc: { views: 1 },
                });
                res.json({
                    message: "Video fetched successfully",
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
     * /api/admin/videos/update:
     *   patch:
     *     tags:
     *       - Videos
     *     summary: Update a video
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Video ObjectId
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title:
     *                 type: string
     *               description:
     *                 type: string
     *               videoUrl:
     *                 type: string
     *               thumbnailUrl:
     *                 type: string
     *               duration:
     *                 type: string
     *               tags:
     *                 type: array
     *                 items:
     *                   type: string
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Video updated successfully
     *       400:
     *         description: Video not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static updateVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const videoData = yield video_1.default.findById(id);
                if (!videoData) {
                    throw new customError_1.default("Video not found");
                }
                const updatedVideo = yield video_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign(Object.assign({}, req.body), { updated_by: req.admin._id }),
                }, { new: true }).populate({ path: "created_by", select: "firstName lastName" });
                res.json({
                    status_code: 200,
                    message: "Video updated successfully",
                    data: updatedVideo,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @swagger
     * /api/admin/videos/delete:
     *   delete:
     *     tags:
     *       - Videos
     *     summary: Delete a video
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Video ObjectId
     *     responses:
     *       200:
     *         description: Video deleted successfully
     *       400:
     *         description: Video not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static deleteVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const videoData = yield video_1.default.findById(id);
                if (!videoData) {
                    throw new customError_1.default("Video not found");
                }
                yield video_1.default.findByIdAndDelete(id);
                res.json({
                    status_code: 200,
                    message: "Video deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.videoController = videoController;
//# sourceMappingURL=videoController.js.map