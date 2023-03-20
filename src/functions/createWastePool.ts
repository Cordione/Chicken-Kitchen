import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';
import { saveFile } from './saveFile';

export function createWastePool(trash: IObjectInWarehouse[], src: string) {
    const trashAsStrings: string[] = [];
    for(const element of trash){
        trashAsStrings.push(`${element.name}, ${element.quantity}`)
    }
    const saved = saveFile(trashAsStrings, src);
    return saved;
}
