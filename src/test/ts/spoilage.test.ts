import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { spoilFood } from '../../functions/utils/spoilFood';
import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

describe('Spoilage Tests', () => {
    test('Spoil test, 1 chicken was spoiled', () => {
        //given
        const warehouse: IObjectInWarehouse[] = [{ name: `chicken`, quantity: 5 }];
        const allIngredients: IBaseIngredients[] = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const jsonSource = '../../json/number.json';
        const json: IInformationsFromJsonFile = commandJSONFileOutput(jsonSource);
        const result = spoilFood(allIngredients, warehouse, json, jest.fn<number, number[]>().mockReturnValueOnce(0.001).mockReturnValueOnce(15));
        expect(result).toEqual([{ name: 'chicken', quantity: 1 }]);
    });
    test('Spoil test, all except one chicken was spoiled', () => {
        //given
        const warehouse: IObjectInWarehouse[] = [{ name: `chicken`, quantity: 5 }];
        const allIngredients: IBaseIngredients[] = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const jsonSource = '../../json/number.json';
        const json: IInformationsFromJsonFile = commandJSONFileOutput(jsonSource);
        const result = spoilFood(allIngredients, warehouse, json, jest.fn<number, number[]>().mockReturnValueOnce(21).mockReturnValue(0.002));
        expect(result).toEqual([{ name: 'chicken', quantity: 4 }]);
    });
});
