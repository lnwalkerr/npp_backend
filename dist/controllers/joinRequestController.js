const joinRequest_1 = require("../models/joinRequest");
const customError_1 = require("../middlewares/customError");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");

class joinRequestController {
    /**
     * Create a new join request (public API)
     */
    static createJoinRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const joinRequestData = yield new joinRequest_1.default(req.body).save();
                res.json({
                    message: "Join request submitted successfully",
                    data: joinRequestData,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Get all join requests with filtering and pagination (admin only)
     */
    static getAllJoinRequests(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, type, status, search } = req.query;
                const pageNum = parseInt(page);
                const limitNum = parseInt(limit);
                const skip = (pageNum - 1) * limitNum;

                let filter = {};

                if (type && type !== 'all') {
                    filter.type = type;
                }

                if (status && status !== 'all') {
                    filter.status = status;
                }

                if (search) {
                    filter.$or = [
                        { fullName: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { constituency: { $regex: search, $options: 'i' } }
                    ];
                }

                const totalItems = yield joinRequest_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalItems / limitNum);

                const requests = yield joinRequest_1.default.find(filter)
                    .sort({ created_at: -1 })
                    .skip(skip)
                    .limit(limitNum);

                res.json({
                    message: "Join requests fetched successfully",
                    data: requests,
                    pagination: {
                        currentPage: pageNum,
                        totalPages,
                        totalItems,
                        limit: limitNum
                    },
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Get join request by ID (admin only)
     */
    static getJoinRequestById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield joinRequest_1.default.findById(req.params.id);
                if (!request) {
                    throw new customError_1.default("Join request not found");
                }

                res.json({
                    message: "Join request fetched successfully",
                    data: request,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Approve a join request (admin only)
     */
    static approveJoinRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, remarks } = req.body;

                const request = yield joinRequest_1.default.findById(id);
                if (!request) {
                    throw new customError_1.default("Join request not found");
                }

                if (request.status !== 'pending') {
                    throw new customError_1.default("Request has already been reviewed");
                }

                const updatedRequest = yield joinRequest_1.default.findByIdAndUpdate(id, {
                    status: 'approved',
                    reviewedBy: req.admin._id,
                    reviewedAt: utils_1.Utils.indianTimeZone(),
                    remarks: remarks || request.remarks,
                    updated_at: utils_1.Utils.indianTimeZone()
                }, { new: true });

                res.json({
                    message: "Join request approved successfully",
                    data: updatedRequest,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Reject a join request (admin only)
     */
    static rejectJoinRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, remarks } = req.body;

                const request = yield joinRequest_1.default.findById(id);
                if (!request) {
                    throw new customError_1.default("Join request not found");
                }

                if (request.status !== 'pending') {
                    throw new customError_1.default("Request has already been reviewed");
                }

                const updatedRequest = yield joinRequest_1.default.findByIdAndUpdate(id, {
                    status: 'rejected',
                    reviewedBy: req.admin._id,
                    reviewedAt: utils_1.Utils.indianTimeZone(),
                    remarks: remarks || request.remarks,
                    updated_at: utils_1.Utils.indianTimeZone()
                }, { new: true });

                res.json({
                    message: "Join request rejected successfully",
                    data: updatedRequest,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Delete a join request (admin only)
     */
    static deleteJoinRequest(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = yield joinRequest_1.default.findById(req.query.id);
                if (!request) {
                    throw new customError_1.default("Join request not found");
                }

                yield joinRequest_1.default.findByIdAndDelete(req.query.id);

                res.json({
                    message: "Join request deleted successfully",
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}

exports.joinRequestController = joinRequestController;
