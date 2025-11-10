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
exports.adminValidator = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../../models/user");
const platform_1 = require("../../models/platform");
class adminValidator {
    static create() {
        return [
            (0, express_validator_1.body)("userType", "userType Is Required"),
            (0, express_validator_1.body)("firstName", "firstName Is Required"),
            (0, express_validator_1.body)("lastName", "lastName Is Required"),
            (0, express_validator_1.body)("email", "email Is Required")
                .isEmail()
                .notEmpty()
                .withMessage("Email is not valid")
                .toLowerCase()
                .custom((value, { req }) => {
                return user_1.default.findOne({ email: value })
                    .select("email")
                    .then((user) => {
                    if (user) {
                        throw new Error("User already exists with the provided email");
                    }
                    else {
                        return true;
                    }
                });
            })
                .withMessage("User already exists with the provided email"),
            (0, express_validator_1.body)("phone", "phone Is Required")
                .notEmpty()
                .isLength({ min: 10, max: 10 })
                .withMessage("Mobile Number must include 10 digits only")
                .custom((value, { req }) => {
                return user_1.default.findOne({ phone: value })
                    .select("phone")
                    .then((user) => {
                    if (user) {
                        throw new Error("User already exists with the provided mobile number");
                    }
                    else {
                        return true;
                    }
                });
            })
                .withMessage("User already exists with the provided mobile number"),
            (0, express_validator_1.body)("password")
                .optional() // Marking the password as optional
                .isStrongPassword()
                .withMessage("Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character"),
        ];
    }
    static login() {
        let userData;
        return [
            (0, express_validator_1.body)("userId", "UserId is Required")
                .notEmpty()
                .custom((userId_1, _a) => __awaiter(this, [userId_1, _a], void 0, function* (userId, { req }) {
                try {
                    userData = yield user_1.default.findOne({
                        phone: userId,
                        otpStatus: true,
                        status: true,
                    })
                        .populate("userType")
                        .populate("constituency")
                        .populate("registrationType");
                }
                catch (e) {
                    userData = yield user_1.default.findOne({
                        username: userId,
                        otpStatus: true,
                        status: true,
                    })
                        .populate("userType")
                        .populate("constituency")
                        .populate("registrationType");
                }
                if (!userData)
                    throw new Error("User Does Not Exist");
                req.admin = userData;
                return true;
            })),
            (0, express_validator_1.body)("password", "Password is Required").trim().notEmpty(),
            (0, express_validator_1.body)("platformName").exists().withMessage("Plz provide required field"),
            (0, express_validator_1.body)("platformToken")
                .trim()
                .notEmpty()
                .withMessage("Plz provide required field")
                .custom((value, { req }) => {
                return platform_1.default
                    .findOne({ name: req.body.platformName })
                    .then((plat) => __awaiter(this, void 0, void 0, function* () {
                    if (plat) {
                        req.platformId = plat._id;
                        return true;
                    }
                    else {
                        throw new Error("wrong field provided");
                    }
                }));
            }),
            (0, express_validator_1.body)("deviceDetail").exists().withMessage("Plz provide required field"),
        ];
    }
}
exports.adminValidator = adminValidator;
//# sourceMappingURL=adminValidators.js.map