"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const User_schema_1 = require("../models/User.schema");
/**
 * @route POST api/auth/register
 * @desc Register user
 * @access Public
 */
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        const userExists = yield User_schema_1.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = yield User_schema_1.User.create({ email: email, username: username, password: password });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.register = register;
/**
 * @route POST api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 */
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_schema_1.User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isMatch = yield user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = user.generateJWT();
        res.status(200).json({ token });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
exports.login = login;
//# sourceMappingURL=auth.controller.js.map