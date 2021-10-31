"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
function default_1() {
    const app = (0, express_1.default)();
    app.use((req, res, next) => {
        const err = new Error('Not found');
        return res.json({ msg: err.message });
    });
    const port = process.env.PORT || 8000;
    app.listen(port, () => console.log(`Listening on ${port}.`));
    return app;
}
exports.default = default_1;
