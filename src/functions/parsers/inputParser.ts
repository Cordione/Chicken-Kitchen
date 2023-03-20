import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { createRawArray } from './utils/createRawArray';

export function inputParser(sourceString: string, baseIngredients: IBaseIngredients[]) {
    const rawArray = createRawArray(sourceString);
    const formatedArray: ICommandAndParameters[] = [];
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '' && x != ' ');
        const formatedLine = singleLine.map(word => word.trim());
        if (formatedLine[0].toLowerCase() === 'Throw trash away'.toLowerCase()) {
            formatedArray.push({ command: formatedLine[0], parameters: [] });
        }
        if (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Buy'.toLowerCase()) {
            formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1], formatedLine[2]] });
        } else if (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Order'.toLowerCase()) {
            const isProperNumber = parseFloat(formatedLine[2]);
            if (!isNaN(isProperNumber) && isProperNumber > 0) {
                const formatedLineWithoutFirstWord: string[] = [];
                formatedArray.push({ command: formatedLine[0], parameters: formatedLineWithoutFirstWord });
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
        } else if (singleLine[0].toLowerCase() == 'table'.toLowerCase()) {
            const formatedLineWithoutFirstWord: string[] = [];
            for (let i = 1; i < formatedLine.length; i++) {
                formatedLineWithoutFirstWord.push(formatedLine[i]);
            }
            formatedArray.push({ command: formatedLine[0], parameters: formatedLineWithoutFirstWord });
        } else if (singleLine[0].toLowerCase() == 'Audit'.toLowerCase()) {
            formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1]] });
        } else if (
            singleLine[0].toLowerCase() != 'Buy'.toLowerCase() &&
            singleLine[0].toLowerCase() != 'Order'.toLowerCase() &&
            singleLine[0].toLowerCase() != 'Budget'.toLowerCase() &&
            singleLine[0].toLowerCase() != 'table'.toLowerCase()
        ) {
            formatedArray.push({ command: formatedLine[0], parameters: [] });
        }
    }
    return formatedArray;
}
// console.log(inputParser('./src/txt_files/input.txt', baseIngredientsParser('./src/csv_files/baseIngredients.csv')));
