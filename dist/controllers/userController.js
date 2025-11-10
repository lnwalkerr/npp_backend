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
exports.userController = void 0;
const customError_1 = require("../middlewares/customError");
const helper_1 = require("../middlewares/helper");
const user_1 = require("../models/user");
const userToken_1 = require("../models/userToken");
const utils_1 = require("../utils/utils");
const mongoose = require("mongoose");
const Jwt = require("jsonwebtoken");
class userController {
    static create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body.candidateId = yield (0, helper_1.generateUserToken)();
                if (req.body.password) {
                    req.body.password = yield utils_1.Utils.encryptPassword(req.body.password);
                }
                req.body.otpStatus = true;
                let data = yield new user_1.default(req.body).save();
                res.json({
                    message: "User Save Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static getByIdUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = yield user_1.default
                    .findOne({
                    _id: req.query.id,
                })
                    .populate({ path: "userType", select: "type title" })
                    .populate({ path: "constituency", select: "value" })
                    .populate({ path: "registrationType", select: "value" });
                if (!data) {
                    throw new customError_1.default("user not found");
                }
                res.json({
                    message: "user Fetch Successfully",
                    data: data,
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
    static updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.query;
                req.body.updated_at = utils_1.Utils.indianTimeZone();
                const userData = yield user_1.default.findById(id);
                if (!userData) {
                    throw new customError_1.default("user not found");
                }
                const upUser = yield user_1.default.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(id) }, {
                    $set: Object.assign({}, req.body),
                }, { new: true });
                res.json({
                    status_code: 200,
                    message: "Updated Successfully",
                    data: upUser,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { password } = req.body;
                const userData = req.admin;
                let isValid = yield utils_1.Utils.checkPassword(password, userData.password);
                if (!isValid)
                    throw new customError_1.default("Detail Does not Match!!!");
                const token = Jwt.sign({
                    candidateId: userData.candidateId,
                    admin_id: userData._id,
                }, process.env.JWT_SECRET, { expiresIn: "24h" });
                // userToken add/update
                let userTokenData = yield userToken_1.default.findOne({
                    userId: userData._id,
                    platformId: req.platformId,
                });
                if (userTokenData) {
                    yield userToken_1.default.findOneAndUpdate({ userId: userData._id, platformId: req.platformId }, {
                        token,
                        deviceDetail: req.body.deviceDetail,
                        updated_at: utils_1.Utils.indianTimeZone(),
                    }, {
                        new: true,
                        useFindAndModify: false,
                    });
                }
                else {
                    yield new userToken_1.default({
                        platformId: req.platformId,
                        userId: userData._id,
                        token,
                        deviceDetail: req.body.deviceDetail,
                    }).save();
                }
                const response = {
                    statusCode: 200,
                    token: token,
                    message: "Login Successfully",
                    data: userData,
                };
                res.status(200).json(response);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.userController = userController;
//# sourceMappingURL=userController.js.map