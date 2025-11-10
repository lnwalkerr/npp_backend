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
const customError_1 = require("./customError");
function hasRole(allowedPermission) {
    const roleMiddleware = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const user = req.admin;
            const agentRoles = ["admin", "member"];
            let role = user.userType.type;
            if (role == "superAdmin") {
                next();
                return true;
            }
            else if (agentRoles.includes(role) && allowedPermission) {
                const permissionArray = allowedPermission.split(".");
                const module = permissionArray[0];
                const property = permissionArray[1];
                if (user &&
                    user.adminUserPermission &&
                    user.adminUserPermission[module] &&
                    user.adminUserPermission[module][property]) {
                    next();
                    return true;
                }
                else {
                    throw new customError_1.default("You have not right to perform this action.");
                }
            }
            else {
                throw new customError_1.default("You have not right to perform this action.");
            }
        }
        catch (error) {
            next(error);
            return false;
        }
    });
    return roleMiddleware;
}
exports.default = hasRole;
//# sourceMappingURL=role.middleware.js.map