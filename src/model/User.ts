import { DataTypes, Model, Optional } from 'sequelize';
import { Database } from '../database/Database';

const sequelize = Database.getInstance();

interface UserAttributes {
    id: number;
    telegramId: number;
    score: number;
    countOfQuestion: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'score' | 'countOfQuestion'> {}

export class User extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes {
    public id!: number;
    public telegramId!: number;
    public score!: number;
    public countOfQuestion!: number;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        telegramId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            unique: true,
            field: "telegram_id",
        },
        score: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        countOfQuestion: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            field: "count_question",
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);
