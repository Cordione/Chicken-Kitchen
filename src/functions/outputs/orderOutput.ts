import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';
import { handleOrder } from '../utils/handleOrder';

export function orderOutput(
    commandAndParameters: ICommandAndParameters,
    baseIngredients: IBaseIngredients[],
    food: IFood[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    const specificIngredient = commandAndParameters.parameters[0];
    const amount = commandAndParameters.parameters[1];
    return handleOrder(specificIngredient, amount, baseIngredients, food, restaurant, warehouse, informationsFromJSONFile);
}
