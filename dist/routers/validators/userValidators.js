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
exports.userValidator = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../../models/user");
const platform_1 = require("../../models/platform");
const utils_1 = require("../../utils/utils");
class userValidator {
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
        return [
            (0, express_validator_1.body)("userId", "User Token is Required")
                .notEmpty()
                .custom((userId, { req }) => {
                return user_1.default.findOne({
                    $or: [{ candidateId: userId }, { phone: userId }],
                    otpStatus: true,
                })
                    .populate("userType")
                    .populate("constituency")
                    .populate("registrationType")
                    .then((user) => {
                    if (user) {
                        req.admin = user;
                        return true;
                    }
                    else {
                        throw new Error("User Does Not Exist");
                    }
                });
            }),
            (0, express_validator_1.body)()
                .custom((value) => value.password || value.mpin)
                .withMessage("Either 'password' or 'mpin' must be provided"),
            (0, express_validator_1.body)("mpin")
                .optional() // Makes it optional
                .isLength({ min: 4, max: 4 })
                .withMessage("MPIN must be exactly 4 digits.") // Checks if the length is exactly 4
                .isNumeric() // Ensures it's numeric
                .withMessage("MPIN must be numeric."),
            (0, express_validator_1.body)("platformName").exists().withMessage("Plz provide required field"),
            (0, express_validator_1.body)("platformToken")
                .exists()
                .withMessage("Plz provide required field")
                .custom((platformToken, { req }) => {
                return platform_1.default
                    .findOne({ name: req.body.platformName })
                    .then((plat) => __awaiter(this, void 0, void 0, function* () {
                    if (plat) {
                        let check = yield utils_1.Utils.comparePassword({
                            plainPassword: plat.platformId,
                            encryptedPassword: platformToken,
                        });
                        req.platformId = plat._id;
                        // condition for which usertype access which platform
                        const isMember = req.admin["userType"].type === "member" ||
                            req.admin["userType"].type === "admin";
                        const isWebOrAndroid = req.body.platformName === "web" ||
                            req.body.platformName === "android";
                        if ((isMember && isWebOrAndroid) ||
                            (!isMember && !isWebOrAndroid)) {
                            return true;
                        }
                        else {
                            throw new Error("You are not authorized to login to this platform");
                        }
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
exports.userValidator = userValidator;
//# sourceMappingURL=userValidators.js.map