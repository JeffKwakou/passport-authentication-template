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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = require("../database.config");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const sequelize = database_config_1.databaseConfig;
exports.User = sequelize.define('User', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: new sequelize_1.DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: "users",
    hooks: {
        beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            user.password = yield bcrypt_1.default.hash(user.password, salt);
        })
    }
});
exports.User.prototype.comparePassword = function (password) {
    return bcrypt_1.default.compare(password, this.password);
};
exports.User.prototype.generateJWT = function () {
    return jsonwebtoken_1.default.sign({
        id: this.id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET);
};
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield sequelize.sync({ force: true });
}))();
//# sourceMappingURL=User.schema.js.map