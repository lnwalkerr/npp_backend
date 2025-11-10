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
exports.Utils = void 0;
const moment = require("moment-timezone");
const Bcrypt = require("bcryptjs");
;
const customError_1 = require("../middlewares/customError");
class Utils {
    constructor() {
        // INDIAN TIMEZONE FOR ALL SCHEMAS
        this.indianTimeZone = moment.tz(Date.now(), "Asia/Kolkata");
    }
    static indianTimeZone() {
        return moment.tz(Date.now(), "Asia/Kolkata");
    }
    // Encrypt Password
    static encryptPassword(password) {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(hash);
                }
            });
        });
    }
    // Compare Password
    static comparePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                Bcrypt.compare(password.plainPassword, password.encryptedPassword, (err, isSame) => {
                    if (err) {
                        reject(err);
                    }
                    else if (!isSame) {
                        reject(new customError_1.default("Detail Does not Match"));
                    }
                    else {
                        resolve(true);
                    }
                });
            });
        });
    }
    static checkPassword(password, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Bcrypt.compare(password, hash);
        });
    }
}
exports.Utils = Utils;
//# sourceMappingURL=utils.js.map