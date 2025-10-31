import { Country } from '../model/Country';
import {FlagImageService} from "./FlagImageService";

export interface QuizQuestion {
    countryId: number;
    flagPath: string;
    options: string[];
    correctOption: string;
}

export class QuizService {

    /**
     * Генерирует один вопрос викторины
     */
    public static async generateQuestion(excludeIds: Set<number> = new Set()): Promise<QuizQuestion> {

        const allCountries = await Country.findAll();
        const availableCountries = allCountries.filter(c => !excludeIds.has(c.id));

        if (availableCountries.length === 0) {
            throw new Error('Все страны уже показаны!');
        }

        const correctCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
        const otherCountries = availableCountries
            .filter(c => c.id !== correctCountry.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);

        const options = [correctCountry.nameRus, ...otherCountries.map(c => c.nameRus)]
            .sort(() => 0.5 - Math.random()); // перемешиваем

        const flagPath = FlagImageService.getFlagPath(correctCountry.isoCode);

        return {
            countryId: correctCountry.id,
            flagPath,
            options,
            correctOption: correctCountry.nameRus,
        };
    }
}
