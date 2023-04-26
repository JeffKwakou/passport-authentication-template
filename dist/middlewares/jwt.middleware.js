"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const passport_jwt_1 = require("passport-jwt");
const User_schema_1 = require("../models/User.schema");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};
module.exports = passport => {
    passport.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => {
        User_schema_1.User.findOne({ where: { id: jwt_payload.id } })
            .then(user => {
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        })
            .catch(err => console.log(err));
    }));
};
//# sourceMappingURL=jwt.middleware.js.map