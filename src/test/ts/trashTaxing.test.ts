import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { totalMoneyThrownToTrash } from '../../functions/utils/totalMoneyThrownToTrash';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

describe('Trash taxing tests', () => {
    test(`We have 1010 potatoes in warehouse -> it was  cleaned, 1010 was thrown away. We have to tax it.`, () => {
        //given
        const trash: IObjectInWarehouse[][] = [[{ name: `potatoes`, quantity: 505 }], [{ name: `potatoes`, quantity: 505 }]];
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const food = foodParser('./src/test/csv/baseIngredients.csv');

        //when
        const result = totalMoneyThrownToTrash(trash, food, baseIngredients, 15);
        //then
        //  Tax is 3030 * 0.15 = 454.5
        //  Fine is applied 454/5 = 4 times.
        //  Fine is 20 per fine
        //  Therefore, total owned is: 454.5 + 20 * 4 = 535.
        expect(result).toEqual(535);
    });
    test(`We have 5000 water in warehouse -> it was  cleaned, 4990 was thrown away. We have to tax it.`, () => {
        //given
        const trash: IObjectInWarehouse[][] = [[{ name: `water`, quantity: 4990 }]];
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const food = foodParser('./src/test/csv/baseIngredients.csv');
        //when
        const result = totalMoneyThrownToTrash(trash, food, baseIngredients, 15);
        //then
        //  Tax is 4990 * 0.15 = 748.5
        //  Fine is applied 748/8 = 7 times.
        //  Fine is 20 per fine
        //  Therefore, total owned is: 748.5 + 20 * 7 = 889.
        expect(result).toEqual(889);
    });
});
