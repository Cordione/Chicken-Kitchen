import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

export function updateWarehouseStateAndReturnWhatWasWasted(
    innerWarehouseStockpile: IObjectInWarehouse[],
    baseIngredients: IBaseIngredients[],
    food: IFood[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    let wasted: IObjectInWarehouse[] = [];
    let sum = 0;
    const maxCapacity = informationsFromJSONFile.totalMaximum != undefined ? informationsFromJSONFile.totalMaximum : 500;
    for (const element of innerWarehouseStockpile) {
        const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
        const isDish = food.find(x => x.name.toLowerCase() === element.name.toLowerCase());
        const maxBaseIngredientsQuantity = informationsFromJSONFile.maxIngredientType != undefined ? informationsFromJSONFile.maxIngredientType : 10;
        const maxBaseDishQuantity = informationsFromJSONFile.maxDishType != undefined ? informationsFromJSONFile.maxDishType : 3;
        // console.log(`${element.name}, ${isBaseIngredient?.name}, ${isDish?.name} `);
        if (isBaseIngredient && element.quantity > maxBaseIngredientsQuantity) {
            wasted.push({ name: element.name, quantity: element.quantity - maxBaseIngredientsQuantity });
            element.quantity = maxBaseIngredientsQuantity;
        } else if (isDish && element.quantity > maxBaseDishQuantity) {
            wasted.push({ name: element.name, quantity: element.quantity - maxBaseDishQuantity });
            element.quantity = maxBaseDishQuantity;
        }

        sum += element.quantity;
        if (maxCapacity < sum) {
            element.quantity = element.quantity - (sum - maxCapacity) > 0 ? element.quantity - (sum - maxCapacity) : 0;
            const wasOnWastedList = wasted.find(x => x.name.toLowerCase() === element.name.toLowerCase());
            if (wasOnWastedList) {
                const whereItIs = wasted.findIndex(x => x.name.toLowerCase() === element.name.toLowerCase());
                wasted.splice(whereItIs, 1);
            } else {
                wasted.push({ name: element.name, quantity: element.quantity });
            }
        }
    }

    return wasted;
}
