import { IFood } from '../../Interface/IFood';
import { countPriceOfOrder } from '../utils/countPriceOfOrder';
import { baseIngredientsParser } from './baseIngredientsParser';
import { createRawArray } from './utils/createRawArray';
import { trimMe } from './utils/trimMe';
export function foodParser(sourceString: string) {
    
    //Stage 1, Preparing Data
    const rawArray = createRawArray(sourceString);
    const foodArray: IFood[] = [];
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    
    //Stage 2, Split input into command strings
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '');
        const secondToNColumn = trimMe(singleLine, 0);
        if (singleLine.length > 1) {
            foodArray.push({ name: singleLine[0], ingerdients: secondToNColumn, price: 0, rawIngredients: [] });
        }
    }

    //Stage 3: Bussiness logic

    countPriceOfOrder(foodArray, baseIngredients);
    return foodArray;
}

// console.log(foodParser('./src/csv_files/food.csv'))
