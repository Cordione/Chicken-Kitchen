import * as fs from 'fs';
import { trimMe } from '../../utils/trimMe';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
export function customerAlergies(sourceString: string) {
    //Pass recived input to fs.fileReadSync as source
    //Split recived input by new line \n\r
    //map trought it to create new lines as single arrays
    const rawArray = fs
        .readFileSync(sourceString, {
            encoding: 'utf-8',
        })
        .split('\r\n')
        .map((row: string): string[] => {
            return row.split(',');
        });

    //Create array containing list of customer objects
    const customerArray: ICustomerAlergies[] = [];
    //Run throught recived output array
    //Trim all inputs nicely
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '');
        const secondToNColumn = trimMe(singleLine);
        if (singleLine.length == 1) {
            customerArray.push({ customerName: singleLine[0], alergies: [] });
        } else if (singleLine.length > 1) {
            customerArray.push({ customerName: singleLine[0], alergies: secondToNColumn });
        }
    }
    return customerArray;
}
console.log(customerAlergies('./src/csv_files/customer_alergies.csv'));
