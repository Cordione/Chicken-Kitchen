import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { baseIngredientsParser } from './baseIngredientsParser';
import { createRawArray } from './utils/createRawArray';

export function inputParser(sourceString: string, baseIngredients: IBaseIngredients[]) {
    const rawArray = createRawArray(sourceString);
    const formatedArray: ICommandAndParameters[] = [];
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '' && x != ' ');
        const formatedLine = singleLine.map(word => word.trim());
        if (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Buy'.toLowerCase()) {
            formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1], formatedLine[2]] });
        } else if (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Order'.toLowerCase()) {
            const isProperNumber = parseFloat(formatedLine[2]);
            if (baseIngredients.find(ingredient => ingredient.name.toLowerCase() == formatedLine[1].trim().toLowerCase()) && !isNaN(isProperNumber) && isProperNumber > 0) {
                formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1], formatedLine[2]] });
            } else {
                // -If no throw error.
                throw new Error('You want to order unknown ingredient');
            }
        } else if (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Budget'.toLowerCase()) {
            // If commands equals to "Budget":
            // - Second parameter must equal to one of those "=", "-", "+"
            if (formatedLine[1].trim() == '=' || formatedLine[1].trim() == '-' || formatedLine[1].trim() == '+') {
                formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1], formatedLine[2]] });
            } else {
                // -If no throw error.
                throw new Error(`You passed wrong sign, acceptable signs are: - + = `);
            }
        }
    }
    return formatedArray;
}
console.log(inputParser('./src/txt_files/input.txt', baseIngredientsParser('./src/csv_files/baseIngredients.csv')));
