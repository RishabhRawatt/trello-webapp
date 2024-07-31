"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const app_js_1 = __importDefault(require("./app.js"));
(0, db_1.default)()
    .then(() => {
    app_js_1.default.listen(process.env.SERVER_PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.SERVER_PORT}`);
    });
})
    .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
});
