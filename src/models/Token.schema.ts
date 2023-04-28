import { DataTypes } from "sequelize";
import { databaseConfig } from "../database.config";

const sequelize = databaseConfig;

export const Token:any = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: new DataTypes.INTEGER,
        allowNull: false
    },
    token: {
        type: new DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
}, {
    tableName: "tokens",
});

Token.associate = (models: any) => {
    models.Token.belongsTo(models.User, { foreignKey: 'userId' });
};