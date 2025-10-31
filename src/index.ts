import dotenv from 'dotenv';
import {Bot} from "./bot/Bot";

dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN!);
bot.launch();
