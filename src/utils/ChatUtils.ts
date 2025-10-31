import { InlineKeyboardMarkup } from "telegraf/typings/core/types/typegram";

export class ChatUtils {
    buildOptionsKeyboard(options: string[]): InlineKeyboardMarkup {
        // Каждая кнопка в отдельной строке
        const inline_keyboard = options.map(option => [
            { text: option, callback_data: option },
        ]);

        return { inline_keyboard };
    }

}
