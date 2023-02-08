import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { createRawArray } from './utils/createRawArray';

export function baseIngredientsParser(sourceString: string) {
    const rawArray = createRawArray(sourceString).flat();

    //Create array containing list of customer objects
    const baseIngredients: IBaseIngredients[] = [];
    //Run throught recived output array
    //Trim all inputs nicely

    for (let index = 0; index < rawArray.length; index++) {
        const singleWord = rawArray[index].split(':');
        const costAsNumber = parseInt(singleWord[1]);
        if (singleWord.length > 0 && singleWord[0] != '') {
            baseIngredients.push({ name: singleWord[0].trim(), cost: costAsNumber });
        }
    }
    return baseIngredients;
}
// console.log(baseIngredientsParser('./src/csv_files/baseIngredients.csv'));
