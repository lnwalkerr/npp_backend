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
exports.globalMiddleWare = void 0;
const express_validator_1 = require("express-validator");
const Jwt = require("jsonwebtoken");
const user_1 = require("../models/user");
class globalMiddleWare {
    static checkError(req, res, next) {
        const error = (0, express_validator_1.validationResult)(req);
        if (!error.isEmpty()) {
            console.log("error::", error);
            let message = error.array()[0].msg;
            return res.status(400).json({
                message,
                status_code: 400,
            });
        }
        else {
            next();
        }
    }
    // for admin
    static adminAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
                Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        console.log("err::", err);
                        return res.status(401).json({
                            status_code: 401,
                            message: "Not Authorised",
                        });
                    }
                    else if (!decoded) {
                        console.log("err2::", err);
                        return res.status(401).json({
                            status_code: 401,
                            message: "Not Authorised",
                        });
                    }
                    else {
                        let adminData = yield user_1.default
                            .findOne({
                            _id: decoded.admin_id,
                        })
                            .select("userType parentId firstName lastName status phone email constituency registrationType")
                            .populate({ path: "userType", select: "type title" })
                            .populate({ path: "registrationType", select: "value" })
                            .populate({ path: "constituency", select: "value" })
                            .populate({ path: "parentId", select: "name" });
                        if (adminData &&
                            (adminData.userType["type"] == "superAdmin" ||
                                adminData.userType["type"] == "admin") &&
                            adminData.status == true) {
                            req.admin = adminData;
                            next();
                        }
                        else {
                            return res.status(401).json({
                                status_code: 401,
                                message: "Not Authorised",
                            });
                        }
                    }
                }));
            }
            catch (e) {
                console.log(e);
                return res.status(401).json({
                    status_code: 401,
                    message: "Not Authorised",
                });
            }
        });
    }
    // for user
    static userAuthenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                const token = authHeader ? authHeader.slice(7, authHeader.length) : null;
                if (!token)
                    return res.status(401).json({
                        status_code: 401,
                        message: "Not Authorised",
                    });
                Jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        // next(new CustomError("Not Authorised", 401 ));
                        console.log(err);
                        return res.status(401).json({
                            status_code: 401,
                            message: "Not Authorised",
                        });
                    }
                    else if (!decoded) {
                        return res.status(401).json({
                            status_code: 401,
                            message: "Not Authorised",
                        });
                    }
                    else {
                        let userData = yield user_1.default
                            .findOne({
                            _id: decoded.admin_id,
                        })
                            .populate({ path: "userType", select: "type title" })
                            .populate({ path: "registrationType", select: "value" })
                            .populate({ path: "constituency", select: "value" })
                            .select("firstName lastName phone email candidateId userType constituency registrationType");
                        req.admin = userData;
                        next();
                    }
                }));
            }
            catch (e) {
                return res.status(401).json({
                    status_code: 401,
                    message: "Not Authorised",
                });
            }
        });
    }
}
exports.globalMiddleWare = globalMiddleWare;
//# sourceMappingURL=globalMiddleWare.js.map