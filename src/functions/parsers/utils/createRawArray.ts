import * as fs from 'fs';
export function createRawArray(sourceString: string) {
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
    return rawArray;
}
