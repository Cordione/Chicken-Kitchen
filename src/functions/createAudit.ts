import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { IFood } from '../Interface/IFood';
import { IInformationsFromJsonFile } from '../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';

export function createAudit(
    auditArray: string[],
    warehouseStates: IObjectInWarehouse[][],
    restaurantBugets: number[],
    whatWasWasted: IObjectInWarehouse[][],
    informationsFromJsonFile: IInformationsFromJsonFile,
    baseIngredients: IBaseIngredients[],
    food: IFood[]
) {
    const output: string[] = [];
    for (let index = 0; index < auditArray.length; index++) {
        const warehouseState = warehouseStates[index];
        const warehouseAsString: string[] = [];
        const wasted = whatWasWasted[index];
        const whatWasWastedAsString: string[] = [];
        const maxBaseIngredientsQuantity = informationsFromJsonFile.maxIngredientType != undefined ? informationsFromJsonFile.maxIngredientType : 10;
        const maxBaseDishQuantity = informationsFromJsonFile.maxDishType != undefined ? informationsFromJsonFile.maxDishType : 3;
        for (const element of warehouseState) {
            warehouseAsString.push(element.name, element.quantity.toString());
        }
        // for (const element of wasted) {
        //     whatWasWastedAsString.push(element.name, element.quantity.toString());
        // }
        console.log(wasted);
        if (index == 0) {
            output.push(`Initial state:`);
            output.push(`Warehouse: ${warehouseAsString}`);
            if (whatWasWasted[0][0].name.toLowerCase() !== 'None'.toLowerCase()) {
                for (const element of wasted) {
                    const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                    const isDish = food.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                    if (isBaseIngredient) {
                        output.push(`Wasted: ${element.name}, quantity: ${element.quantity} max amount in warehouse: ${maxBaseIngredientsQuantity}`);
                    }
                    if (isDish) {
                        output.push(`Wasted: ${element.name}, quantity: ${element.quantity}, max amount in warehouse ${maxBaseDishQuantity}`);
                    }
                }
            }
            output.push(`Restaurant Budget: ${restaurantBugets[index]}`);
        }
        if (index != 0 && index < auditArray.length) {
            output.push(`Command: ${auditArray[index]}`);
            output.push(`Warehouse: ${warehouseAsString}`);
            if (whatWasWasted[index][0].name.toLowerCase() !== 'None'.toLowerCase()) {
                for (const element of wasted) {
                    const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                    const isDish = food.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                    if (isBaseIngredient) {
                        output.push(`Wasted: ${element.name}, quantity: ${element.quantity}, max amount in warehouse: ${maxBaseIngredientsQuantity}`);
                    }
                    if (isDish) {
                        output.push(`Wasted: ${element.name}, quantity: ${element.quantity}, max amount in warehouse ${maxBaseDishQuantity}`);
                    }
                }
            }
            output.push(`Restaurant Budget: ${restaurantBugets[index]}`);
        }

        if (index + 1 == auditArray.length) {
            output.push(`Audit End`);
        }
    }
    return output;
}
