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
exports.websiteController = void 0;
const news_1 = require("../models/news");
const user_1 = require("../models/user");
const userType_1 = require("../models/userType");
class websiteController {
    static homePage(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userRole = yield userType_1.default.findOne({ type: "member" });
                const memberData = yield user_1.default.find({
                    userType: userRole._id,
                    status: true,
                });
                let newsData = yield news_1.default
                    .find({
                    isActive: true,
                })
                    .populate({ path: "type", select: "value" })
                    .populate({ path: "created_by", select: "firstName lastName" })
                    .sort({ created_at: -1 })
                    .limit(4);
                res.json({
                    message: "data fetch Successfully",
                    data: {
                        activeMember: memberData.length,
                        newsData,
                    },
                    status_code: 200,
                });
            }
            catch (e) {
                next(e);
            }
        });
    }
}
exports.websiteController = websiteController;
//# sourceMappingURL=websiteController.js.map