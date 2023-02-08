import { IFood } from '../../Interface/IFood';
import { createRawArray } from './utils/createRawArray';
import { trimMe } from './utils/trimMe';
export function foodParser(sourceString: string) {
    const rawArray = createRawArray(sourceString);
    const foodArray: IFood[] = [];
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '');
        const secondToNColumn = trimMe(singleLine, 0);
        if (singleLine.length > 1) {
            foodArray.push({ name: singleLine[0], ingerdients: secondToNColumn });
        }
    }
    return foodArray;
}

// console.log(foodParser('./src/csv_files/food.csv'))
