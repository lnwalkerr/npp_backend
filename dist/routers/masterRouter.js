"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const masterDataController_1 = require("../controllers/masterDataController");
const globalMiddleWare_1 = require("../middlewares/globalMiddleWare");
const role_middleware_1 = require("../middlewares/role.middleware");
const validRolePermisson_1 = require("../middlewares/validRolePermisson");
class masterRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get("/masterCategory/getById", 
        // globalMiddleWare.adminAuthenticate,
        globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getByIdMasterCategory);
        this.router.get("/masterCategory/getAll", 
        // globalMiddleWare.adminAuthenticate,
        globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getAllMasterCategory);
        this.router.get("/masterData/getById", 
        // globalMiddleWare.adminAuthenticate,
        globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getByIdMasterData);
        this.router.get("/masterData/getAll", 
        // globalMiddleWare.adminAuthenticate,
        globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getAllMasterData);
        this.router.get("/masterData/getByMasterCategoryId", 
        // globalMiddleWare.adminAuthenticate,
        globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getMasterDataByMasterCategoryId);
        this.router.get("/platform/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getByIdPlatform);
        this.router.get("/platform/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.getAllPlatform);
    }
    postRoutes() {
        this.router.post("/masterCategory/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.MASTER_CATEGORY_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.createMasterCategory);
        this.router.post("/masterData/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.MASTERDATA_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.createMasterData);
        this.router.post("/platform/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.PLATFORM_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.createPlatform);
    }
    patchRoutes() {
        this.router.patch("/masterCategory/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.MASTER_CATEGORY_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.updateMasterCategory);
        this.router.patch("/masterData/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.MASTERDATA_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.updateMasterData);
        this.router.patch("/platform/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.PLATFORM_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, masterDataController_1.masterDataController.updatePlatformData);
    }
    deleteRoutes() { }
}
exports.default = new masterRouter().router;
//# sourceMappingURL=masterRouter.js.map