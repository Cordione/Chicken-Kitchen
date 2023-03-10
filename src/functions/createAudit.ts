import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';

export function createAudit(auditArray: string[], warehouseStates: IObjectInWarehouse[][], restaurantBugets: number[]) {
    const output: string[] = [];
    for (let index = 0; index < auditArray.length; index++) {
        const warehouseState = warehouseStates[index];
        const warehouseAsString: string[] = [];
        for (const element of warehouseState) {
            warehouseAsString.push(element.name, element.quantity.toString());
        }

        if (index == 0) {
            output.push(`Initial state:`);
            output.push(`Warehouse: ${warehouseAsString}`);
            output.push(`Restaurant Budget: ${restaurantBugets[index]}`);
        }
        if (index != 0 && index < auditArray.length) {
            output.push(`Command: ${auditArray[index]}`);
            output.push(`Warehouse: ${warehouseAsString}`);
            output.push(`Restaurant Budget: ${restaurantBugets[index]}`);
        }

        if (index + 1 == auditArray.length) {
            output.push(`Audit End`);
        }
    }
    return output;
}
