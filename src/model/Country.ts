import { DataTypes, Model, Optional } from 'sequelize';
import { Database } from '../database/Database';

const sequelize = Database.getInstance();

interface CountryAttributes {
    id: number;
    name: string;
    nameRus: string;
    isoCode: string;
}

interface CountryCreationAttributes extends Optional<CountryAttributes, 'id'> {}

export class Country extends Model<CountryAttributes, CountryCreationAttributes>
    implements CountryAttributes {
    public id!: number;
    public name!: string;
    public nameRus!: string;
    public isoCode!: string;
}

Country.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nameRus: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "name_rus",
        },
        isoCode: {
            type: DataTypes.STRING(5),
            allowNull: false,
            field: "iso_code",
        },
    },
    {
        sequelize,
        tableName: 'country',
        timestamps: false,
    }
);
