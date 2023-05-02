import { DataTypes, Model, Optional } from "sequelize";
import { databaseConfig } from "../database.config";
import { Token, TokenInstance } from "./Token.schema";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

const sequelize = databaseConfig;

interface UserAttributes {
    id: number;
    email: string;
    username: string;
    password?: string;
    isVerified: boolean;
    googleId?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
    id?: number;
}
  
export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
    createdAt?: Date;
    updatedAt?: Date;

    comparePassword(password: string): Promise<boolean>;

    generateJWT(): string;

    generateVerificationToken(): TokenInstance;
}

export const User = sequelize.define<UserInstance>('User', {
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
        allowNull: true,
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    tableName: "users",
    hooks: {
        beforeCreate: async (user: UserInstance) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
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