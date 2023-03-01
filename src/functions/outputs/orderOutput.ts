import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

export function orderOutput(commandAndParameters: ICommandAndParameters, baseIngredients: IBaseIngredients[], restaurant: IRestaurant) {
    if (commandAndParameters.parameters != undefined) {
        const specificIngredient = commandAndParameters.parameters[0];
        const amount = commandAndParameters.parameters[1];
        const singleUnit = baseIngredients.find(ingredient => {
            if (ingredient.name.trim().toLowerCase() == specificIngredient.trim().toLowerCase()) {
                return ingredient;
            }
        });
        //Reduce restaurant budget by recived order
        restaurant.budget -= singleUnit!.cost * parseFloat(amount);
        return `We ordered ${parseFloat(amount)}x ${specificIngredient} and current restaurant budget is ${restaurant.budget.toFixed(2)}`;
    }
}
