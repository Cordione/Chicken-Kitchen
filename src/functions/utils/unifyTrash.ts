import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

export function unifyTrash(trash: IObjectInWarehouse[][]) {
    const trashes: IObjectInWarehouse[] = trash.flat(2);
    const unifiedList: IObjectInWarehouse[] = [];
    for (let i = 0; i < trashes.length; i++) {
        const alreadyOnList = unifiedList.find(x => x.name.toLowerCase() === trashes[i].name.toLowerCase());
        if (alreadyOnList) {
            alreadyOnList.quantity += trashes[i].quantity;
        } else {
            unifiedList.push({ name: trashes[i].name, quantity: trashes[i].quantity });
        }
    }
    return unifiedList;
}
