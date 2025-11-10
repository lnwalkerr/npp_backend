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
exports.generateUserToken = generateUserToken;
const user_1 = require("../models/user");
function generateUserToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const genToken = () => Math.floor(1000000000 + Math.random() * 9000000000); // Generate a random 10-digit token
        let randomToken = genToken();
        while (yield user_1.default.findOne({ candidateId: randomToken })) {
            randomToken = genToken();
        }
        return randomToken;
    });
}
//# sourceMappingURL=helper.js.map