import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../Interface/ICommandAndParameters';
import { IInformationsFromJsonFile } from '../Interface/IInformationsFromJsonFIle';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';
import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';
import { IRestaurant } from '../Interface/IRestaurant';
import { budgetOutput } from './outputs/bugetOutput';
import { buyOutput } from './outputs/buyOutput';
import { orderOutput } from './outputs/orderOutput';
import { tableOutput } from './outputs/tableOutput';
// import * as commands from '../json/commands.json';

export function takeOrder(
    commandAndParameters: ICommandAndParameters,
    customers: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    if (restaurant.budget >= 0) {
        //Add variable to store information about total cost of order, set initial value to 0;
        const restaurantMarkup: number = informationsFromJSONFile.profitMargin != undefined ? parseFloat(`1.${informationsFromJSONFile.profitMargin}`) : 1.3;
        let output = '';
        if (commandAndParameters.command.toLowerCase() == 'buy'.toLowerCase() && commandAndParameters.parameters != undefined) {
            if (informationsFromJSONFile.buy == 'yes') {
                return buyOutput(commandAndParameters, customers, food, baseIngredients, restaurantMarkup, restaurant, warehouse, informationsFromJSONFile);
            } else {
                return `Buy command disabled.`;
            }
        } else if (commandAndParameters.command.toLowerCase() == 'order'.toLowerCase() && commandAndParameters.parameters != undefined) {
            //Find matching element price, store it, multiply it by amount of orders
            if (informationsFromJSONFile.order == 'yes') {
                return orderOutput(commandAndParameters, baseIngredients, restaurant, warehouse, informationsFromJSONFile);
            } else {
                return `Order command disabled.`;
            }
        } else if (commandAndParameters.command.toLowerCase() == 'budget'.toLowerCase() && commandAndParameters.parameters != undefined) {
            if (informationsFromJSONFile.budget == 'yes') {
                return budgetOutput(commandAndParameters, restaurant);
            } else {
                return `Budget command disabled.`;
            }
        } else if (commandAndParameters.command.toLowerCase() == 'table'.toLowerCase()) {
            if (informationsFromJSONFile.table == 'yes') {
                return tableOutput(commandAndParameters, customers, food, baseIngredients, restaurantMarkup, restaurant, warehouse, informationsFromJSONFile);
            } else {
                return `Table Command disabled.`;
            }
        } else if (
            commandAndParameters.command.toLowerCase() != 'buy'.toLowerCase() &&
            commandAndParameters.command.toLowerCase() != 'order'.toLowerCase() &&
            commandAndParameters.command.toLowerCase() != 'budget'.toLowerCase() &&
            commandAndParameters.command.toLowerCase() != 'table'.toLowerCase() &&
            commandAndParameters.command.toLowerCase() != 'Audit'.toLowerCase()
        ) {
            return `${commandAndParameters.command} command disabled.`;
        }
    }
    if (restaurant.budget < 0) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        return `RESTAURANT BANKRUPT`;
    }
}
