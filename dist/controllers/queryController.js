const query_1 = require("../models/query");
const customError_1 = require("../middlewares/customError");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");

class queryController {
    /**
     * Create a new query (public API)
     */
    static createQuery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const queryData = yield new query_1.default(req.body).save();
                res.json({
                    message: "Query submitted successfully",
                    data: queryData,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Get all queries with filtering and pagination (admin only)
     */
    static getAllQueries(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, category, priority, status, search, constituency, sortBy = "createdAt", sortOrder = "desc" } = req.query;
                const pageNum = parseInt(page);
                const limitNum = parseInt(limit);
                const skip = (pageNum - 1) * limitNum;

                let filter = {};

                if (category && category !== "All Categories") {
                    filter.category = category;
                }

                if (priority && priority !== "All Priorities") {
                    filter.priority = priority;
                }

                if (status && status !== "All Statuses") {
                    filter.status = status;
                }

                if (constituency) {
                    filter.constituency = { $regex: constituency, $options: 'i' };
                }

                if (search) {
                    filter.$or = [
                        { subject: { $regex: search, $options: 'i' } },
                        { message: { $regex: search, $options: 'i' } },
                        { constituency: { $regex: search, $options: 'i' } }
                    ];
                }

                const sortOptions = {};
                sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

                const totalItems = yield query_1.default.countDocuments(filter);
                const totalPages = Math.ceil(totalItems / limitNum);

                const queries = yield query_1.default.find(filter)
                    .sort(sortOptions)
                    .skip(skip)
                    .limit(limitNum);

                res.json({
                    message: "Queries fetched successfully",
                    data: queries,
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
     * Get query by ID (admin only)
     */
    static getQueryById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield query_1.default.findById(req.params.id);
                if (!query) {
                    throw new customError_1.default("Query not found");
                }

                res.json({
                    message: "Query fetched successfully",
                    data: query,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }

    /**
     * Update query (admin only)
     */
    static updateQuery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                req.body.updated_at = utils_1.Utils.indianTimeZone();

                const query = yield query_1.default.findById(id);
                if (!query) {
                    throw new customError_1.default("Query not found");
                }

                const updatedQuery = yield query_1.default.findByIdAndUpdate(id, {
                    $set: Object.assign({}, req.body),
                }, { new: true });

                res.json({
                    status_code: 200,
                    message: "Query updated successfully",
                    data: updatedQuery,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }

    /**
     * Delete query (admin only)
     */
    static deleteQuery(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = yield query_1.default.findById(req.params.id);
                if (!query) {
                    throw new customError_1.default("Query not found");
                }

                yield query_1.default.findByIdAndDelete(req.params.id);

                res.json({
                    message: "Query deleted successfully",
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}

exports.queryController = queryController;
