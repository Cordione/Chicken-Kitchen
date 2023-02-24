import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { createRawArray } from './utils/createRawArray';

export function inputParser(sourceString: string) {
    const rawArray = createRawArray(sourceString);
    const formatedArray: ICommandAndParameters[] = [];
    for (let index = 0; index < rawArray.length; index++) {
        const singleLine = rawArray[index].filter(x => x != '' && x != ' ');
        if (
            (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Buy'.toLowerCase()) ||
            (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Order'.toLowerCase()) ||
            (singleLine.length > 2 && singleLine[0].toLowerCase() == 'Budget'.toLowerCase())
        ) {
            const formatedLine = singleLine.map(word => word.trim());
            console.log();
            formatedArray.push({ command: formatedLine[0], parameters: [formatedLine[1], formatedLine[2]] });
        }
    }
    return formatedArray;
}
console.log(inputParser('./src/txt_files/input.txt'));
