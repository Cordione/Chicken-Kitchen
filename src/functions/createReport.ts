import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { IFood } from '../Interface/IFood';
import { IInformationsFromJsonFile } from '../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';
import { saveFile } from './saveFile';

export function createReport(
    restaurantBudgetIterations: number[],
    outputArray: string[],
    whatWasWasted: IObjectInWarehouse[][],
    informationsFromJsonFile: IInformationsFromJsonFile,
    baseIngredients: IBaseIngredients[],
    food: IFood[]
) {
    //Function should take array of strings as parameter
    //First parameter should be array containing restaurant budget changes
    //Second array should contain other things which will happend i.e orders of food.

    //is Restaurant Bankrupt
    let isRestaurantBankrupt: boolean = false;
    //Array to store all outputs before writing a file.
    const finalArray: string[] = [];

    const maxBaseIngredientsQuantity = informationsFromJsonFile.maxIngredientType != undefined ? informationsFromJsonFile.maxIngredientType : 10;
    const maxBaseDishQuantity = informationsFromJsonFile.maxDishType != undefined ? informationsFromJsonFile.maxDishType : 3;
    for (let index = 0; index < outputArray.length; index++) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        const wasted = whatWasWasted[index];
        const whatWasWastedAsString: string[] = [];

        if (wasted != undefined) {
            for (const element of wasted) {
                whatWasWastedAsString.push(element.name, element.quantity.toString());
            }
        }
        if (restaurantBudgetIterations[index] < 0) {
            isRestaurantBankrupt = true;
        }
        if (index == 0 && !isRestaurantBankrupt) {
            finalArray.push(`Restaurant budget: ${restaurantBudgetIterations[0].toFixed(2)}`);
        }

        if (!isRestaurantBankrupt) {
            finalArray.push(outputArray[index]);
        }
        if (whatWasWastedAsString[0] != undefined && whatWasWastedAsString[0].toLowerCase() != 'None'.toLowerCase()) {
            const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === whatWasWastedAsString[0].toLowerCase());
            const isDish = food.find(x => x.name.toLowerCase() === whatWasWastedAsString[0].toLowerCase());
            if (isBaseIngredient) {
                finalArray.push(`Wasted: ${whatWasWastedAsString}, max amount in warehouse: ${maxBaseIngredientsQuantity}`);
            }
            if (isDish) {
                finalArray.push(`Wasted: ${whatWasWastedAsString}, max amount in warehouse ${maxBaseDishQuantity}`);
            }
        }
        if (index == outputArray.length - 1 && !isRestaurantBankrupt) {
            finalArray.push(`Restaurant budget: ${restaurantBudgetIterations[restaurantBudgetIterations.length - 1].toFixed(2)}`);
        }

        if (isRestaurantBankrupt) {
            finalArray.push(`RESTAURANT BANKRUPT`);
        }
    }
    //Save array as file
    const saved = saveFile(finalArray, './src/reports/Restaurant.txt');
    return saved;
}
