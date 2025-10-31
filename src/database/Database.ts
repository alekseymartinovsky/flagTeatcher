import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export class Database {
    private static instance: Sequelize;

    public static getInstance(): Sequelize {
        if (!Database.instance) {
            Database.instance = new Sequelize({
                dialect: 'mysql',
                host: process.env.DB_HOST,
                username: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                logging: false, // можно включить для отладки
            });
            console.log('🗄️ Sequelize подключен к MySQL');
        }

        return Database.instance;
    }

    public static async testConnection() {
        try {
            await Database.getInstance().authenticate();
            console.log('✅ Подключение к базе данных успешно');
        } catch (error) {
            console.error('❌ Ошибка подключения к базе данных:', error);
        }
    }
}
