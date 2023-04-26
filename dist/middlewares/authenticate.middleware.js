"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const passport_1 = __importDefault(require("passport"));
const authenticate = (req, res, next) => {
    passport_1.default.authenticate('jwt', (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).send({ message: 'Unauthorized Access' });
        }
        req.body.user = user;
        next();
    })(req, res, next);
};
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.middleware.js.map