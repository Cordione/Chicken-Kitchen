import { orderOutput } from '../../functions/outputs/orderOutput';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
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
        //when
        expect(warehouse[1]).toEqual({ name: 'Tuna', quantity: 5 });
        const result = orderOutput(input, baseIngredients, restaurant, warehouse);
        //then
        expect(result).toEqual(`We ordered 10x tuna and current restaurant budget is 250.00`);
        expect(warehouse[1]).toEqual({ name: 'Tuna', quantity: 15 });
    });
});
