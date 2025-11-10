"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
class PublicRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
    }
    getRoutes() {
        // Public content API - no authentication required
        this.router.get("/content", publicController_1.default.getCombinedContent);
    }
}
exports.default = new PublicRouter().router;
//# sourceMappingURL=publicRouter.js.map