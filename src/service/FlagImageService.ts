import path from 'path';
import fs from 'fs';

export class FlagImageService {
    private static basePath = path.join(__dirname, '../../assets/flags/');

    /**
     * Возвращает полный путь к файлу флага по ISO-коду.
     *
     * @param isoCode ISO-код страны (например: 'FR', 'DE', 'JP')
     */
    public static getFlagPath(isoCode: string): string {
        return path.join(this.basePath, `/${isoCode.toLowerCase()}.png`);
    }

    /**
     * Возвращает путь к файлу флага, если он существует, иначе — null.
     *
     * @param isoCode ISO-код страны
     */
    public static getExistingFlag(isoCode: string): string | null {
        const filePath = this.getFlagPath(isoCode.toLowerCase());
        return fs.existsSync(filePath) ? filePath : null;
    }
}
