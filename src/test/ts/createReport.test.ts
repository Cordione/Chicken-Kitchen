import { createReport } from '../../functions/createReport';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

describe('Create report tests', () => {
    test('Should properly return base ingredients', () => {
        //given
        const restaurantBudgetIterations: number[] = [500, 617];
        const orders: string[] = ['Alexandra Smith have budget: 500 -> wants to order Princess Chicken, which cost: 117.00: success'];
        const wasted: IObjectInWarehouse[][] = [[{name: 'none', quantity: 0}], [{name: 'none', quantity: 0}], [{name: 'none', quantity: 0}]];
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const food = foodParser('./src/csv_files/food.csv');
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv')
        const totalTrashTaxValue = 0
        //when
        const report = createReport(restaurantBudgetIterations, orders, wasted, json, baseIngredients, food, totalTrashTaxValue);
        //then
        expect(report[0]).toEqual('Restaurant budget: 500');
        expect(report[1]).toEqual('Alexandra Smith have budget: 500 -> wants to order Princess Chicken, which cost: 117.00: success');
        expect(report[2]).toEqual('Restaurant budget: 617');
    });
});
