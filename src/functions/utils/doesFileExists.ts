import * as fs from 'fs';

export function doesFileExists(path: string): boolean {
    let output: boolean = true;
    if (fs.existsSync(path)) {
        output = true;
    } else {
        output = false;
    }
    return output;
}

// console.log(doesFileExists('./src/csv_files/warehouse.csv'));
