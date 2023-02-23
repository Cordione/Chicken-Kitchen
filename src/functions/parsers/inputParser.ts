import { createRawArray } from './utils/createRawArray';

export function inputParser(sourceString: string) {
    const rawArray = createRawArray(sourceString);
    const formatedArray: string[][] = [];
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '' && x != ' ');
        if ((singleLine.length > 2 && singleLine[0].toLowerCase() == 'Buy'.toLowerCase()) || (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Order'.toLowerCase()) || (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Budget'.toLowerCase())) {
            const formatedLine = singleLine.map(word => word.trim());
            formatedArray.push(formatedLine);
        }
    }
    return formatedArray;
}
inputParser('./src/txt_files/input.txt');
