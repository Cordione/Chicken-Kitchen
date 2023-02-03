import * as fs from 'fs';
import { IcustomerAlergies } from './IcustomerAlergies';
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
    const customerArray: IcustomerAlergies[] = [];
    //Run throught recived output array
    //Trim all inputs nicely
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '');

        const innerArray: string[] = [];
        for (const row of singleLine) {
            innerArray.push(row.trim());
        }
        const secondToNColumn: string[] = [];
        for (let idx = 1; idx < singleLine.length; idx++) {
            secondToNColumn.push(innerArray[idx]);
        }

        if (singleLine.length == 1) {
            customerArray.push({ customerName: singleLine[0], alergies: [] });
        } else if (singleLine.length > 1) {
            customerArray.push({ customerName: singleLine[0], alergies: secondToNColumn });
        }
    }
    return customerArray
}
customerAlergies('./src/csv_files/customer_alergies.csv');
