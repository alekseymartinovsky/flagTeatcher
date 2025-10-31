import { Context } from 'telegraf';
import {CountryService} from "../../service/CountryService";
import {FlagImageService} from "../../service/FlagImageService";

export async function handleText(ctx: Context) {
    //@ts-ignore
    const input = ctx.message.text?.trim();
    if (!input) return;

    const country = await CountryService.findByRussianName(input);

    if (!country) {
        return ctx.reply(`Не удалось найти страну "${input}" в базе.`);
    }

    const flagPath = FlagImageService.getExistingFlag(country.isoCode);

    if (flagPath) {
        await ctx.replyWithPhoto(
            { source: flagPath },
            { caption: `${country.nameRus} (${country.name})` }
        );
    } else {
        await ctx.reply(
            `Флаг для ${country.nameRus} (${country.isoCode}) не найден.`
        );
    }
}
