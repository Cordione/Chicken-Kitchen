import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { updateWarehouseStateAndReturnWhatWasWasted } from '../../functions/utils/updateWarehouseState';

describe('UpdateWarehouse tests', () => {
    test('Should properly ', () => {
        //given
        const initialWarehouseSupplies = [
            { name: 'Chicken', quantity: 50 },
            { name: 'Tuna', quantity: 10 },
            { name: 'Potatoes', quantity: 10 },
            { name: 'Asparagus', quantity: 10 },
            { name: 'Milk', quantity: 10 },
            { name: 'Honey', quantity: 10 },
            { name: 'Paprika', quantity: 10 },
            { name: 'Garlic', quantity: 10 },
            { name: 'Water', quantity: 10 },
            { name: 'Lemon', quantity: 10 },
            { name: 'Tomatoes', quantity: 10 },
            { name: 'Pickles', quantity: 10 },
            { name: 'Feta', quantity: 10 },
            { name: 'Vinegar', quantity: 10 },
            { name: 'Rice', quantity: 10 },
            { name: 'Chocolate', quantity: 10 },
            { name: 'Youth Sauce', quantity: 10 },
            { name: 'Emperor Chicken', quantity: 10 },
        ];
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const json = commandJSONFileOutput('../../json/allEnabled.json');
        //when
        const result = updateWarehouseStateAndReturnWhatWasWasted(initialWarehouseSupplies, allIngredients, allFood, json);
        //then
        expect(result[0]).toEqual({name: "Chicken", quantity: 40})
        expect(result[1]).toEqual({name: "Youth Sauce", quantity: 7})
        console.log(result.length)
    });
});
