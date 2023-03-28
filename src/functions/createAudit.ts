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
    food: IFood[],
    tips: number[],
    dailyTax: number[]
) {
    const output: string[] = [];
    // console.log(`at`, auditArray)
    // console.log(`wasted`, whatWasWasted)
    tips.splice(0, 0, 0);
    for (let index = 0; index < auditArray.length; index++) {
        const warehouseState = warehouseStates[index];
        const warehouseAsString: string[] = [];
        const wasted = whatWasWasted[index];
        const maxBaseIngredientsQuantity = informationsFromJsonFile.maxIngredientType != undefined ? informationsFromJsonFile.maxIngredientType : 10;
        const maxBaseDishQuantity = informationsFromJsonFile.maxDishType != undefined ? informationsFromJsonFile.maxDishType : 3;
        for (const element of warehouseState) {
            warehouseAsString.push(element.name, element.quantity.toString());
        }
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
        if (index > 0 && index < auditArray.length) {
            output.push(`Command result: ${auditArray[index]}`);
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
            output.push(
                `Restaurant Budget ${restaurantBugets[index]}: We had: ${restaurantBugets[0]} initial money, profit from orders after taxes: ${
                    restaurantBugets[index] - restaurantBugets[0] - tips.flat().reduce((a, b) => a + b, 0)
                }, recived in tips ${tips.flat().reduce((a, b) => a + b, 0)}`
            );
            output.push(`Daily tax from orders to pay: ${dailyTax[0]}`);
            output.push(`Daily tax from tips to pay: ${dailyTax[1]}`);
            output.push(`Audit End`);
        }
    }
    return output;
}
