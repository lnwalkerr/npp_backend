"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class customError extends Error {
    constructor(message, status = 400) {
        super();
        this.status = status;
        this.message = message;
    }
}
exports.default = customError;
//# sourceMappingURL=customError.js.map