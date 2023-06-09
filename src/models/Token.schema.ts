import { DataTypes, Model, Optional } from "sequelize";
import { databaseConfig } from "../database.config";
import { User } from "./User.schema";

const sequelize = databaseConfig;

interface TokenAttributes {
    id: number;
    userId: number;
    token: string;
}

interface TokenCreationAttributes extends Optional<TokenAttributes, 'id'> {
    id?: number;
}
  
export interface TokenInstance extends Model<TokenAttributes, TokenCreationAttributes>, TokenAttributes {
    createdAt?: Date;
    updatedAt?: Date;
}

export const Token = sequelize.define<TokenInstance>('Token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    tableName: "tokens",
});