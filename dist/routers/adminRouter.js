"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userTypeController_1 = require("../controllers/userTypeController");
const globalMiddleWare_1 = require("../middlewares/globalMiddleWare");
const adminController_1 = require("../controllers/adminController");
const newsController_1 = require("../controllers/newsController");
const validRolePermisson_1 = require("../middlewares/validRolePermisson");
const role_middleware_1 = require("../middlewares/role.middleware");
const websiteController_1 = require("../controllers/websiteController");
const donationController_1 = require("../controllers/donationController");
const eventController_1 = require("../controllers/eventController");
const videoController_1 = require("../controllers/videoController");
const leaderController_1 = require("../controllers/leaderController");
const adminValidators_1 = require("./validators/adminValidators");
const imageController_1 = require("../controllers/imageController");
const fileUpload_1 = require("../utils/fileUpload");
const joinRequestController_1 = require("../controllers/joinRequestController");
const queryController_1 = require("../controllers/queryController");
class adminRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get("/userType/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, userTypeController_1.userTypeController.getByIdUserType);
        this.router.get("/userType/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, userTypeController_1.userTypeController.getAllUserType);
        this.router.get("/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, adminController_1.admincontroller.getByIdUser);
        this.router.get("/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, adminController_1.admincontroller.getAllUsers);
        this.router.get("/news/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.NEWS_VIEWER), globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.getByIdNews);
        this.router.get("/news/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.NEWS_VIEWER), globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.getAllNews);
        this.router.get("/website/homePage", globalMiddleWare_1.globalMiddleWare.checkError, websiteController_1.websiteController.homePage);
        this.router.get("/website/allNews", globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.getAllNews);
        this.router.get("/website/newsById", globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.getByIdNews);
        this.router.get("/donation/getAll", globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.getAllDonationMaster);
        this.router.get("/donation/getById", globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.getByIdDonationMaster);
        this.router.get("/events/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, eventController_1.eventController.getByIdEvent);
        this.router.get("/events/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, eventController_1.eventController.getAllEvents);
        this.router.get("/videos/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, videoController_1.videoController.getByIdVideo);
        this.router.get("/videos/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, videoController_1.videoController.getAllVideos);
        this.router.get("/leaders/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, leaderController_1.leaderController.getByIdLeader);
        this.router.get("/leaders/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, leaderController_1.leaderController.getAllLeaders);
        this.router.get("/join-requests/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, joinRequestController_1.joinRequestController.getJoinRequestById);
        this.router.get("/join-requests/getAll", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, joinRequestController_1.joinRequestController.getAllJoinRequests);
        this.router.get("/queries/:id", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, queryController_1.queryController.getQueryById);
        this.router.get("/queries", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, queryController_1.queryController.getAllQueries);
        this.router.get("/getAllRepositories", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, imageController_1.getAllRepositories);
        this.router.get("/getRepositoryById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, imageController_1.getRepositoryById);
    }
    postRoutes() {
        this.router.post("/userType/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.USERTYPE_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, userTypeController_1.userTypeController.createUserType);
        this.router.post("/createRepository", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, fileUpload_1.upload.array("images", 10), imageController_1.createRepository);
        this.router.post("/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.ADMINUSER_CREATOR), adminValidators_1.adminValidator.create(), globalMiddleWare_1.globalMiddleWare.checkError, adminController_1.admincontroller.create);
        this.router.post("/login", adminValidators_1.adminValidator.login(), globalMiddleWare_1.globalMiddleWare.checkError, adminController_1.admincontroller.login);
        this.router.post("/news/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.NEWS_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.create);
        this.router.post("/donation/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.DONATION_MASTER_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.createDonationMaster);
        this.router.post("/events/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.EVENT_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, eventController_1.eventController.create);
        this.router.post("/videos/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.VIDEO_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, videoController_1.videoController.create);
        this.router.post("/leaders/create", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.LEADER_CREATOR), globalMiddleWare_1.globalMiddleWare.checkError, leaderController_1.leaderController.create);
        this.router.post("/website/donateByMember", globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.donateByMember);
    }
    patchRoutes() {
        this.router.patch("/userType/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.USERTYPE_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, userTypeController_1.userTypeController.updateUserType);
        this.router.patch("/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, adminController_1.admincontroller.updateUser);
        this.router.patch("/news/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.NEWS_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.updateNews);
        this.router.delete("/news/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.NEWS_REMOVER), globalMiddleWare_1.globalMiddleWare.checkError, newsController_1.newsController.deleteNews);
        this.router.patch("/donation/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.DONATION_MASTER_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.updateDonationMaster);
        this.router.patch("/events/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.EVENT_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, eventController_1.eventController.updateEvent);
        this.router.patch("/videos/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.VIDEO_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, videoController_1.videoController.updateVideo);
        this.router.patch("/leaders/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.LEADER_EDITOR), globalMiddleWare_1.globalMiddleWare.checkError, leaderController_1.leaderController.updateLeader);
        this.router.patch("/join-requests/approve", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, joinRequestController_1.joinRequestController.approveJoinRequest);
        this.router.patch("/join-requests/reject", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, joinRequestController_1.joinRequestController.rejectJoinRequest);
        this.router.patch("/queries/:id", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, queryController_1.queryController.updateQuery);
    }
    deleteRoutes() {
        this.router.delete("/userType/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.USERTYPE_REMOVER), globalMiddleWare_1.globalMiddleWare.checkError, userTypeController_1.userTypeController.deleteUserType);
        this.router.delete("/events/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.EVENT_REMOVER), globalMiddleWare_1.globalMiddleWare.checkError, eventController_1.eventController.deleteEvent);
        this.router.delete("/videos/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.VIDEO_REMOVER), globalMiddleWare_1.globalMiddleWare.checkError, videoController_1.videoController.deleteVideo);
        this.router.delete("/leaders/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, (0, role_middleware_1.default)(validRolePermisson_1.PERMISSIONS.LEADER_REMOVER), globalMiddleWare_1.globalMiddleWare.checkError, leaderController_1.leaderController.deleteLeader);
        this.router.delete("/join-requests/delete", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, joinRequestController_1.joinRequestController.deleteJoinRequest);
        this.router.delete("/queries/:id", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, queryController_1.queryController.deleteQuery);
    }
}
exports.default = new adminRouter().router;
//# sourceMappingURL=adminRouter.js.map