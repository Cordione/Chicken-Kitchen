import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';
import { unifyTrash } from './unifyTrash';

export function checkRestaurantState(restaurant: IRestaurant, food: IFood[], trash: IObjectInWarehouse[][], json: IInformationsFromJsonFile) {
    const trashListWithoutDuplicates = unifyTrash(trash);
    const howMuchSpaceItTakes: number[] = [];
    //Check if wasted/spoiled element was dish/baseIngredient
    //If was dish read it's raw ingredient length, multiply it by quantity
    //If it was a base ingredient pass it's quantity.
    for (const element of trashListWithoutDuplicates) {
        const isDish = food.find(x => x.name.toLowerCase() === element.name.toLowerCase());
        if (isDish) {
            howMuchSpaceItTakes.push(isDish.rawIngredients.length * element.quantity);
        } else {
            howMuchSpaceItTakes.push(element.quantity);
        }
    }
    const totalSpaceTaken = howMuchSpaceItTakes.reduce((a, b) => a + b, 0);
    const wasteLimit = json.wasteLimit != undefined ? json.wasteLimit : 50;
    if (totalSpaceTaken > wasteLimit) {
        restaurant.isPoisoned = true;
    } else {
        restaurant.isPoisoned = false;
    }
}
