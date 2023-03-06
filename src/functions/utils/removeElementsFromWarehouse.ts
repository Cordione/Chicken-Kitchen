import { IMaterials } from '../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

export function removeElementsFromWarehouse(usedMaterialsWithQuantities: IMaterials[], warehouse: IObjectInWarehouse[]) {
        usedMaterialsWithQuantities.forEach(el => {
            const itemInWarehouse = warehouse.find(x => x.name.toLowerCase() == el.name.toLowerCase());
            if (itemInWarehouse != undefined) {
                itemInWarehouse.quantity -= el.quantity;
                if (itemInWarehouse.quantity < 0) {
                    itemInWarehouse.quantity = 0;
                }
            }
        });
}
