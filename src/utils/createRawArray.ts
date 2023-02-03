import * as fs from 'fs';
export function createRawArray(sourceString: string) {
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
