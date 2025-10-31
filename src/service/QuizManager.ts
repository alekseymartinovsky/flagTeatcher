import { QuizService, QuizQuestion } from './QuizService';
import { User } from '../model/User';
import { Context } from 'telegraf';
import { ChatUtils } from '../utils/ChatUtils';

interface UserQuizSession {
    currentQuestion: QuizQuestion | null;
    usedCountryIds: Set<number>;
    totalQuestions: number;
    questionsAnswered: number;
}

export enum QuizQuestionType {
    BASE = 10,
    ALL = 193,
}

export class QuizManager {
    private userSessions = new Map<number, UserQuizSession>();
    private chatUtils = new ChatUtils();

    /** Старт викторины для пользователя */
    public async startQuiz(ctx: Context, type: QuizQuestionType): Promise<void> {
        const telegramId = ctx.from?.id;
        if (!telegramId) return;

        this.userSessions.set(telegramId, this.createSession(type));
        await this.sendNextQuestion(telegramId, ctx);
    }

    /** Обработка ответа пользователя */
    public async handleAnswer(ctx: Context): Promise<void> {
        const telegramId = ctx.from?.id;
        if (!telegramId) return;

        const session = this.userSessions.get(telegramId);
        const answer = (ctx.callbackQuery as any)?.data;

        if (!session || !session.currentQuestion || !answer) {
            ctx.answerCbQuery('Нет активного вопроса. Используй /quiz');
            return;
        }

        const user = await this.getOrCreateUser(telegramId);
        session.questionsAnswered += 1;
        user.countOfQuestion += 1;

        if (answer === session.currentQuestion.correctOption) {
            user.score += 1;
            await ctx.reply('✅ Правильно!');
        } else {
            await ctx.reply(`❌ Неправильно! Это ${session.currentQuestion.correctOption}`);
        }

        await user.save();

        if (this.isQuizFinished(session)) {
            await this.finishQuiz(telegramId, ctx, user, session.totalQuestions);
        } else {
            await this.sendNextQuestion(telegramId, ctx, session);
        }

        await ctx.answerCbQuery();
    }

    /** Создаёт новую сессию пользователя */
    private createSession(totalQuestions: number): UserQuizSession {
        return {
            currentQuestion: null,
            usedCountryIds: new Set(),
            totalQuestions,
            questionsAnswered: 0,
        };
    }

    /** Генерация и отправка следующего вопроса */
    private async sendNextQuestion(
        telegramId: number,
        ctx: Context,
        session?: UserQuizSession
    ): Promise<void> {
        const userSession = session || this.userSessions.get(telegramId);
        if (!userSession) return;

        const question = await QuizService.generateQuestion(userSession.usedCountryIds);
        userSession.currentQuestion = question;
        userSession.usedCountryIds.add(question.countryId);
        this.userSessions.set(telegramId, userSession);

        await ctx.replyWithPhoto(
            { source: question.flagPath },
            {
                caption: `Вопрос ${userSession.questionsAnswered + 1}/${userSession.totalQuestions}: угадай страну!`,
                reply_markup: this.chatUtils.buildOptionsKeyboard(question.options),
            }
        );
    }

    /** Проверка, завершена ли викторина */
    private isQuizFinished(session: UserQuizSession): boolean {
        return session.questionsAnswered >= session.totalQuestions;
    }

    /** Завершение викторины */
    private async finishQuiz(
        telegramId: number,
        ctx: Context,
        user: User,
        totalQuestions: number
    ): Promise<void> {
        await ctx.telegram.sendMessage(
            telegramId,
            `🎉 Викторина завершена! Твой итоговый счёт: ${user.score}/${totalQuestions}`
        );
        this.userSessions.delete(telegramId);
    }

    /** Получение или создание пользователя */
    private async getOrCreateUser(telegramId: number): Promise<User> {
        let user = await User.findOne({ where: { telegramId } });
        if (!user) user = await User.create({ telegramId });
        return user;
    }
}
