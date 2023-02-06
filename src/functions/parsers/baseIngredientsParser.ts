import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { createRawArray } from '../../utils/createRawArray';

export function baseIngredientsParser(sourceString: string) {
    const rawArray = createRawArray(sourceString).flat();

    //Create array containing list of customer objects
    const baseIngredients: IBaseIngredients[] = [];
    //Run throught recived output array
    //Trim all inputs nicely
    for (let index = 0; index < rawArray.length; index++) {
        const singleWord = rawArray[index].trim();
        if (singleWord.length > 0 && singleWord != '') {
            baseIngredients.push({ name: singleWord });
        }
    }
    return baseIngredients;
}
// console.log(baseIngredientsParser('./src/csv_files/baseIngredients.csv'));
