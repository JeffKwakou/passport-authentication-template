"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_controller_1 = require("./auth.controller");
const authenticate_middleware_1 = require("../middlewares/authenticate.middleware");
const router = express_1.default.Router();
exports.authRoutes = router;
router.get('/', (req, res) => {
    res.status(200).send("You've reached the auth route");
});
router.post('/login', [
    (0, express_validator_1.check)('email', 'Email is required').isEmail(),
    (0, express_validator_1.check)('password', 'Password is required').exists()
], validate_middleware_1.validate, auth_controller_1.login);
router.post('/register', [
    (0, express_validator_1.check)('email', 'Email is required').isEmail(),
    (0, express_validator_1.check)('username', 'Username is required').not().isEmpty(),
    (0, express_validator_1.check)('password', 'Password is required').not().isEmpty()
], validate_middleware_1.validate, auth_controller_1.register);
router.get('/user', authenticate_middleware_1.authenticate, (req, res) => {
    res.status(200).json(req.body.user);
});
//# sourceMappingURL=routes.js.map