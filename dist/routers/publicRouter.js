"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const joinRequestController_1 = require("../controllers/joinRequestController");
const queryController_1 = require("../controllers/queryController");
class PublicRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
    }
    getRoutes() {
        // Public content API - no authentication required
        this.router.get("/content", publicController_1.default.getCombinedContent);
    }
    postRoutes() {
        // Public join request creation - no authentication required
        this.router.post("/join-request/create", joinRequestController_1.joinRequestController.createJoinRequest);
        // Public query submission - no authentication required
        this.router.post("/queries", queryController_1.queryController.createQuery);
    }
}
exports.default = new PublicRouter().router;
//# sourceMappingURL=publicRouter.js.map