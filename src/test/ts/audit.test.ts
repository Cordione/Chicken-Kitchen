import { createAudit } from '../../functions/createAudit';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

describe('Audit Tests', () => {
    test('Audit test', () => {
        //given
        const finalOutput: string[] = [
            'Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Alexandra Smith has budget: 500 -> wants to order Emperor Chicken, which cost: 370: success',
        ];
        const warehouseStates: IObjectInWarehouse[][] = [
            [
                { name: 'Chicken', quantity: 5 },
                { name: 'Tuna', quantity: 5 },
                { name: 'Potatoes', quantity: 5 },
                { name: 'Asparagus', quantity: 5 },
                { name: 'Milk', quantity: 5 },
                { name: 'Honey', quantity: 5 },
                { name: 'Paprika', quantity: 5 },
                { name: 'Garlic', quantity: 5 },
                { name: 'Water', quantity: 5 },
                { name: 'Lemon', quantity: 5 },
                { name: 'Tomatoes', quantity: 5 },
                { name: 'Pickles', quantity: 5 },
                { name: 'Feta', quantity: 5 },
                { name: 'Vinegar', quantity: 5 },
                { name: 'Rice', quantity: 5 },
                { name: 'Chocolate', quantity: 5 },
            ],
            [
                { name: 'Chicken', quantity: 5 },
                { name: 'Tuna', quantity: 5 },
                { name: 'Potatoes', quantity: 5 },
                { name: 'Asparagus', quantity: 5 },
                { name: 'Milk', quantity: 5 },
                { name: 'Honey', quantity: 5 },
                { name: 'Paprika', quantity: 5 },
                { name: 'Garlic', quantity: 5 },
                { name: 'Water', quantity: 5 },
                { name: 'Lemon', quantity: 5 },
                { name: 'Tomatoes', quantity: 5 },
                { name: 'Pickles', quantity: 5 },
                { name: 'Feta', quantity: 5 },
                { name: 'Vinegar', quantity: 5 },
                { name: 'Rice', quantity: 5 },
                { name: 'Chocolate', quantity: 5 },
            ],
            [
                { name: 'Chicken', quantity: 4 },
                { name: 'Tuna', quantity: 4 },
                { name: 'Potatoes', quantity: 4 },
                { name: 'Asparagus', quantity: 2 },
                { name: 'Milk', quantity: 2 },
                { name: 'Honey', quantity: 2 },
                { name: 'Paprika', quantity: 4 },
                { name: 'Garlic', quantity: 4 },
                { name: 'Water', quantity: 4 },
                { name: 'Lemon', quantity: 5 },
                { name: 'Tomatoes', quantity: 4 },
                { name: 'Pickles', quantity: 4 },
                { name: 'Feta', quantity: 4 },
                { name: 'Vinegar', quantity: 5 },
                { name: 'Rice', quantity: 5 },
                { name: 'Chocolate', quantity: 4 },
            ],
            [
                { name: 'Chicken', quantity: 4 },
                { name: 'Tuna', quantity: 4 },
                { name: 'Potatoes', quantity: 4 },
                { name: 'Asparagus', quantity: 2 },
                { name: 'Milk', quantity: 2 },
                { name: 'Honey', quantity: 2 },
                { name: 'Paprika', quantity: 4 },
                { name: 'Garlic', quantity: 4 },
                { name: 'Water', quantity: 4 },
                { name: 'Lemon', quantity: 5 },
                { name: 'Tomatoes', quantity: 4 },
                { name: 'Pickles', quantity: 4 },
                { name: 'Feta', quantity: 4 },
                { name: 'Vinegar', quantity: 5 },
                { name: 'Rice', quantity: 5 },
                { name: 'Chocolate', quantity: 4 },
            ],
        ];
        const budget: number[] = [500, 500, 870, 870];
        const jsonSource = '../../json/commands.json';
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const json = commandJSONFileOutput(jsonSource);
        const wasted: IObjectInWarehouse[][] = [[{ name: 'none', quantity: 0 }], [{ name: 'none', quantity: 0 }], [{ name: 'none', quantity: 0 }]];
        const tips: number[] = [];
        //when
        const result = createAudit(finalOutput, warehouseStates, budget, wasted, json, allIngredients, allFood, tips);
        //then
        expect(result).toEqual([
            'Initial state:',
            'Warehouse: Chicken,5,Tuna,5,Potatoes,5,Asparagus,5,Milk,5,Honey,5,Paprika,5,Garlic,5,Water,5,Lemon,5,Tomatoes,5,Pickles,5,Feta,5,Vinegar,5,Rice,5,Chocolate,5',
            'Restaurant Budget: 500',
            'Command result: Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Warehouse: Chicken,5,Tuna,5,Potatoes,5,Asparagus,5,Milk,5,Honey,5,Paprika,5,Garlic,5,Water,5,Lemon,5,Tomatoes,5,Pickles,5,Feta,5,Vinegar,5,Rice,5,Chocolate,5',
            'Restaurant Budget: 500',
            'Command result: Alexandra Smith has budget: 500 -> wants to order Emperor Chicken, which cost: 370: success',
            'Warehouse: Chicken,4,Tuna,4,Potatoes,4,Asparagus,2,Milk,2,Honey,2,Paprika,4,Garlic,4,Water,4,Lemon,5,Tomatoes,4,Pickles,4,Feta,4,Vinegar,5,Rice,5,Chocolate,4',
            'Restaurant Budget: 870',
            `Restaurant Budget 870: We had: 500 initial money, profit from orders after taxes: 370, recived in tips 0`,
            'Audit End',
        ]);
        console.log(result);
    });
});
