import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';
import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';
import { IRestaurant } from '../Interface/IRestaurant';
import { budgetOutput } from './outputs/bugetOutput';
import { buyOutput } from './outputs/buyOutput';
import { orderOutput } from './outputs/orderOutput';
import { tableOutput } from './outputs/tableOutput';

export function takeOrder(
    commandAndParameters: ICommandAndParameters,
    customers: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[]
) {
    if (restaurant.budget >= 0) {
        //Add variable to store information about total cost of order, set initial value to 0;
        const restaurantMarkup: number = 1.3;
        let output = '';
        if (commandAndParameters.command.toLowerCase() == 'buy'.toLowerCase() && commandAndParameters.parameters != undefined) {
            output = buyOutput(commandAndParameters, customers, food, baseIngredients, restaurantMarkup, restaurant, warehouse) as string;
        }
        if (commandAndParameters.command.toLowerCase() == 'order'.toLowerCase() && commandAndParameters.parameters != undefined) {
            //Find matching element price, store it, multiply it by amount of orders
            output = orderOutput(commandAndParameters, baseIngredients, restaurant, warehouse) as string;
        }
        if (commandAndParameters.command.toLowerCase() == 'budget'.toLowerCase() && commandAndParameters.parameters != undefined) {
            output = budgetOutput(commandAndParameters, restaurant);
        }
        if (commandAndParameters.command.toLowerCase() == 'table'.toLowerCase()) {
            output = tableOutput(commandAndParameters, customers, food, baseIngredients, restaurantMarkup, restaurant, warehouse) as string;
        }
        return output;
    }
    if (restaurant.budget < 0) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        return `RESTAURANT BANKRUPT`;
    }
}
