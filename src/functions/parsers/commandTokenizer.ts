import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { baseIngredientsParser } from './baseIngredientsParser';
import { trimMe } from './utils/trimMe';

export function commandTokenizer(oneLongString: string, baseIngredients: IBaseIngredients[]) {
    //split recived input by line, remove empty inputs
    const initialInputArray: string[] = oneLongString.split('\n').filter(x => x != '');
    const arrayOfMatchingInterfaces: ICommandAndParameters[] = [];
    for (const singleLine of initialInputArray) {
        let element: ICommandAndParameters = { command: '', parameters: [] };
        const singleLineSplittedByComma = singleLine.split(', ').filter(x => x != '');
        if (singleLineSplittedByComma.length === 1 && singleLineSplittedByComma[0].trim().toLowerCase() === 'Throw trash away'.trim().toLowerCase()) {
            element.command = singleLineSplittedByComma[0].trim();
            element.parameters = [];
            arrayOfMatchingInterfaces.push(element);
        }
        if (
            singleLineSplittedByComma[0].trim().toLowerCase() != 'Buy'.trim().toLowerCase() &&
            singleLineSplittedByComma[0].trim().toLowerCase() != 'Order'.trim().toLowerCase() &&
            singleLineSplittedByComma[0].trim().toLowerCase() != 'budget'.trim().toLowerCase() &&
            singleLineSplittedByComma[0].trim().toLowerCase() != 'Table'.trim().toLowerCase() &&
            singleLineSplittedByComma[0].trim().toLowerCase() != 'Audit'.trim().toLowerCase()
        ) {
            element.command = singleLineSplittedByComma[0].trim();
        }

        if (singleLineSplittedByComma.length == 2) {
            if (singleLineSplittedByComma[0].trim().toLowerCase() == 'Audit'.trim().toLowerCase()) {
                element.command += singleLineSplittedByComma[0].trim();
                element.parameters.push(singleLineSplittedByComma[1].trim());
                arrayOfMatchingInterfaces.push(element);
            }
        }

        if (singleLineSplittedByComma.length >= 3) {
            if (
                singleLineSplittedByComma[0].trim().toLowerCase() == 'Buy'.trim().toLowerCase() ||
                singleLineSplittedByComma[0].trim().toLowerCase() == 'Order'.trim().toLowerCase() ||
                singleLineSplittedByComma[0].trim().toLowerCase() == 'budget'.trim().toLowerCase() ||
                singleLineSplittedByComma[0].trim().toLowerCase() == 'Table'.trim().toLowerCase()
            ) {
                element.command += singleLineSplittedByComma[0].trim();
            }
            if (singleLineSplittedByComma[0].trim().toLowerCase() == 'Buy'.trim().toLowerCase()) {
                element.parameters?.push(singleLineSplittedByComma[1].trim());
                element.parameters?.push(singleLineSplittedByComma[2].trim());
            }
            if (singleLineSplittedByComma[0].trim().toLowerCase() == 'Order'.trim().toLowerCase()) {
                const isProperNumber = parseFloat(singleLineSplittedByComma[2]);
                const secondToNColumn = trimMe(singleLineSplittedByComma, 0);
                if (!isNaN(isProperNumber) && isProperNumber > 0) {
                    secondToNColumn.forEach(el => {
                        element.parameters.push(el);
                    });
                }
            }
            if (singleLineSplittedByComma[0].trim().toLowerCase() == 'budget'.trim().toLowerCase()) {
                // If commands equals to "Budget":
                // - Second parameter must equal to one of those "=", "-", "+"
                if (singleLineSplittedByComma[1].trim() == '=' || singleLineSplittedByComma[1].trim() == '-' || singleLineSplittedByComma[1].trim() == '+') {
                    if (element.parameters != undefined) {
                        element.parameters.push(singleLineSplittedByComma[1].trim());
                        element.parameters.push(singleLineSplittedByComma[2].trim());
                    }
                } else {
                    // -If no throw error.
                    throw new Error(`You passed wrong sign, acceptable signs are: - + = `);
                }
            }
            if (singleLineSplittedByComma[0].trim().toLowerCase() == 'Table'.toLowerCase()) {
                for (let index = 1; index < singleLineSplittedByComma.length; index++) {
                    element.parameters?.push(singleLineSplittedByComma[index]);
                }
            }

            arrayOfMatchingInterfaces.push(element);
        }
    }
    return arrayOfMatchingInterfaces;
}

// console.log(
//     commandTokenizer(
//         `Buy, Julie Mirage, Princess Chicken \n\r Buy, Elon Carousel, Tuna Cake \n\r Sadkl,jaslkdjasldkjaskldjsa\n\r buy, Julie Mirage,\n\r order, tuna, 5\n\r budget, +, 10\ntable, Julie Mirage, Princess Chicken`,
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv')
//     )
// );
// console.log(commandTokenizer(`table, Julie Mirage, Princess Chicken\n Audit, Resources`, baseIngredientsParser('./src/csv_files/baseIngredients.csv')));
