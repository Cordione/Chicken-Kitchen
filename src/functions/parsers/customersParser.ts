import { trimMe } from './utils/trimMe';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { createRawArray } from './utils/createRawArray';
export function customersParser(sourceString: string) {
    //Pass recived input to fs.fileReadSync as source
    //Split recived input by new line \n\r
    //map trought it to create new lines as single arrays
    const rawArray = createRawArray(sourceString);

    //Create array containing list of customer objects
    const customerArray: ICustomerAlergies[] = [];
    //Run throught recived output array
    //Trim all inputs nicely
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '');
        const secondToNColumn = trimMe(singleLine, 1);
        const customerBudget = parseInt(singleLine[singleLine.length - 1]);
        if (singleLine.length == 2) {
            customerArray.push({ customerName: singleLine[0], alergies: [], budget: customerBudget });
        } else if (singleLine.length > 2) {
            customerArray.push({ customerName: singleLine[0], alergies: secondToNColumn, budget: customerBudget });
        }
    }
    return customerArray;
}
console.log(customersParser('./src/csv_files/customersAlergies.csv'));
