import { DataTypes } from "sequelize";
import { databaseConfig } from "../database.config";
import { Token } from "./Token.schema";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const sequelize = databaseConfig;

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    username: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: new DataTypes.STRING,
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
}, {
    tableName: "users",
    hooks: {
        beforeCreate: async (user: any) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
    }
});

User.prototype.comparePassword = function (password: string) {
    return bcrypt.compare(password, this.password);
};

User.prototype.generateJWT = function () {
    return jsonwebtoken.sign({
        id: this.id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET);
};

User.prototype.generateVerificationToken = function () {
    return Token.build({
        userId: this.id,
        token: crypto.randomBytes(20).toString('hex')
    });
};

(async () => {
    await sequelize.sync( { force: true } );
})();