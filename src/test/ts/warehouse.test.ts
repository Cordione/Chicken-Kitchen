import { orderOutput } from '../../functions/outputs/orderOutput';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Warehouse testing', () => {
    test('Add 10 tuna to warehouse, total quantity = 15', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'order',
            parameters: ['tuna', '10'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const warehouse = warehouseParser('', baseIngredients);
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        //when
        expect(warehouse[1]).toEqual({ name: 'Tuna', quantity: 5 });
        const result = orderOutput(input, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toContain("We ordered 10x tuna and current restaurant budget is 225");
        expect(warehouse[1]).toEqual({ name: 'Tuna', quantity: 15 });
    });
});
