"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myServer = void 0;
require("dotenv").config();
const server_1 = require("./server");
let serverInstance = new server_1.Server();
const app = serverInstance.app;
let port = process.env.PORT || 5005;
exports.myServer = app.listen(port, () => {
    console.log(`Aiims Dev Server:: Listening on PORT ${port}`);
    serverInstance.init();
});
//# sourceMappingURL=index.js.map