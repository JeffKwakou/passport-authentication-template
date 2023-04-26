"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const jwt_middleware_1 = __importDefault(require("./middlewares/jwt.middleware"));
const routes_1 = require("./auth/routes");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
(0, jwt_middleware_1.default)(passport_1.default);
// Routes
app.use('/auth', routes_1.authRoutes);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
//# sourceMappingURL=server.js.map