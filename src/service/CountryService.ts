import { Country } from '../model/Country';
import { Op } from 'sequelize';
import {TextUtils} from "../utils/TextUtils";

export class CountryService {
    /**
     * Найти страну по русскому названию
     *
     * @param nameRus Название страны на русском
     */
    public static async findByRussianName(nameRus: string): Promise<Country | null> {
        if (!nameRus) return null;

        return await Country.findOne({
            where: {
                nameRus: { [Op.like]: TextUtils.capitalizeFirstLetter(nameRus) },
            },
        });
    }
}
