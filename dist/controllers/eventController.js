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
exports.eventController = void 0;
const customError_1 = require("../middlewares/customError");
const event_1 = require("../models/event");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
class eventController {
    /**
     * @swagger
     * /api/admin/events/create:
     *   post:
     *     tags:
     *       - Events
     *     summary: Create a new event
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
     *               - date
     *             properties:
     *               title:
     *                 type: string
     *                 description: Event title
     *               description:
     *                 type: string
     *                 description: Event description
     *               date:
     *                 type: string
     *                 format: date-time
     *                 description: Event date and time
     *               location:
     *                 type: string
     *                 description: Event location
     *               status:
     *                 type: string
     *                 enum: [Upcoming, Past, Cancelled]
     *                 default: Upcoming
     *     responses:
     *       200:
     *         description: Event created successfully
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
                let eventData = yield event_1.default.findOne({
                    title: req.body.title,
                    date: req.body.date,
                });
                if (eventData) {
                    throw new customError_1.default("An event with this title and date already exists");
                }
                let data = yield new event_1.default(Object.assign(Object.assign({}, req.body), { created_by: req.admin._id })).save();
                res.json({
                    message: "Event created successfully",
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
     * /api/admin/events/getAll:
     *   get:
     *     tags:
     *       - Events
     *     summary: Get all events with optional filtering and pagination
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: searchText
     *         schema:
     *           type: string
     *         description: Search in title (case insensitive)
     *       - in: query
     *         name: status
     *         schema:
     *           type: string
     *           enum: [Upcoming, Past, Cancelled]
     *         description: Filter by event status
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
     *         description: Events fetched successfully
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
     *                       date:
     *                         type: string
     *                         format: date-time
     *                       location:
     *                         type: string
     *                       status:
     *                         type: string
     *                         enum: [Upcoming, Past, Cancelled]
     *                       image:
     *                         type: object
     *                         properties:
     *                           url:
     *                             type: string
     *                           docSha:
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
    static getAllEvents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { searchText, status, page = 1, limit = 10 } = req.query;
                let filter = {};
                if (status) {
                    filter.status = status;
                }
                if (searchText) {
                    filter.title = { $regex: searchText, $options: "i" };
                }
                const skip = (parseInt(page) - 1) * parseInt(limit);
                const data = yield event_1.default
                    .find(filter)
                    .populate({ path: "created_by", select: "firstName lastName" })
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(parseInt(limit));
                const totalCounts = yield event_1.default.countDocuments(filter);
                res.json({
                    message: "Events fetched successfully",
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
     * /api/admin/events/getById:
     *   get:
     *     tags:
     *       - Events
     *     summary: Get event by ID
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ObjectId
     *     responses:
     *       200:
     *         description: Event fetched successfully
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
     *                     date:
     *                       type: string
     *                       format: date-time
     *                     location:
     *                       type: string
     *                     status:
     *                       type: string
     *                       enum: [Upcoming, Past, Cancelled]
     *                     image:
     *                       type: object
     *                       properties:
     *                         url:
     *                           type: string
     *                         docSha:
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
     *         description: Event not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static getByIdEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield event_1.default
                    .findOne({
                    _id: req.query.id,
                })
                    .populate({ path: "created_by", select: "firstName lastName" });
                if (!data) {
                    throw new customError_1.default("Event not found");
                }
                res.json({
                    message: "Event fetched successfully",
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
     * /api/admin/events/update:
     *   patch:
     *     tags:
     *       - Events
     *     summary: Update an event
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ObjectId
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
     *               date:
     *                 type: string
     *                 format: date-time
     *               location:
     *                 type: string
     *               status:
     *                 type: string
     *                 enum: [Upcoming, Past, Cancelled]
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Event updated successfully
     *       400:
     *         description: Event not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static updateEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const eventData = yield event_1.default.findById(id);
                if (!eventData) {
                    throw new customError_1.default("Event not found");
                }
                const updatedEvent = yield event_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign(Object.assign({}, req.body), { updated_by: req.admin._id }),
                }, { new: true }).populate({ path: "created_by", select: "firstName lastName" });
                res.json({
                    status_code: 200,
                    message: "Event updated successfully",
                    data: updatedEvent,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * @swagger
     * /api/admin/events/delete:
     *   delete:
     *     tags:
     *       - Events
     *     summary: Delete an event
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *         description: Event ObjectId
     *     responses:
     *       200:
     *         description: Event deleted successfully
     *       400:
     *         description: Event not found
     *       401:
     *         description: Unauthorized
     *       500:
     *         description: Internal server error
     */
    static deleteEvent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                const eventData = yield event_1.default.findById(id);
                if (!eventData) {
                    throw new customError_1.default("Event not found");
                }
                yield event_1.default.findByIdAndDelete(id);
                res.json({
                    status_code: 200,
                    message: "Event deleted successfully",
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.eventController = eventController;
//# sourceMappingURL=eventController.js.map