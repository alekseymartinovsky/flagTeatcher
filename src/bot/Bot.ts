import {Telegraf} from 'telegraf';
import {message} from "telegraf/filters";
import {handleText} from "./handlers/textHandler";
import {QuizManager, QuizQuestionType} from "../service/QuizManager";
import {COMMANDS} from "./Commands";

export class Bot {
    private bot: Telegraf;
    private quizManager: QuizManager;
    private readonly baseQuizQuestion = 10;

    constructor(token: string) {
        this.bot = new Telegraf(token);
        this.quizManager = new QuizManager();
        this.initializeCommands();
    }

    private initializeCommands() {
        this.bot.start((ctx) => ctx.reply('Привет! Я помогу тебе узнавать флаги стран 🌍'));
        this.bot.help((ctx) => ctx.reply('Отправь /quiz чтобы начать викторину! Или напиши название страны, чтобы увидеть ее флаг.'));
        this.bot.telegram.setMyCommands([
            { command: COMMANDS.start, description: "Приветствие и проверка бота" },
            { command: COMMANDS.quiz, description: `Начать викторину с флагами (${this.baseQuizQuestion} вопросов)` },
            { command: COMMANDS.test, description: "Тест, содержит флаги всех стран"},
            { command: COMMANDS.help, description: "Показать список команд" },
        ]);

        this.bot.command(COMMANDS.quiz, (ctx) => this.quizManager.startQuiz(ctx, QuizQuestionType.BASE));
        this.bot.command(COMMANDS.test, (ctx) => this.quizManager.startQuiz(ctx, QuizQuestionType.ALL));
        this.bot.on('callback_query', (ctx) => this.quizManager.handleAnswer(ctx));
        this.bot.on(message('text'), handleText);
    }

    public launch() {
        console.log('Бот запущен...');
        this.bot.launch();
    }
}
