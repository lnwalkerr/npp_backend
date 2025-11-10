"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const globalMiddleWare_1 = require("../middlewares/globalMiddleWare");
const donationController_1 = require("../controllers/donationController");
const userValidators_1 = require("./validators/userValidators");
const userController_1 = require("../controllers/userController");
class userRouter {
    constructor() {
        this.router = (0, express_1.Router)();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();
    }
    getRoutes() {
        this.router.get("/getById", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, userController_1.userController.getByIdUser);
    }
    postRoutes() {
        this.router.post("/create", userValidators_1.userValidator.create(), globalMiddleWare_1.globalMiddleWare.checkError, userController_1.userController.create);
        this.router.post("/login", userValidators_1.userValidator.login(), globalMiddleWare_1.globalMiddleWare.checkError, userController_1.userController.login);
        this.router.post("/donation/donateByMember", globalMiddleWare_1.globalMiddleWare.userAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, donationController_1.donationController.donateByMember);
    }
    patchRoutes() {
        this.router.patch("/update", globalMiddleWare_1.globalMiddleWare.adminAuthenticate, globalMiddleWare_1.globalMiddleWare.checkError, userController_1.userController.updateUser);
    }
    deleteRoutes() { }
}
exports.default = new userRouter().router;
//# sourceMappingURL=userRouter.js.map