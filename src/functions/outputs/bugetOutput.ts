import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

export function budgetOutput(commandAndParameters: ICommandAndParameters, restaurant: IRestaurant) {
    let output = '';
    if (commandAndParameters.parameters != undefined) {
        const sign = commandAndParameters.parameters[0];
        const amount = commandAndParameters.parameters[1];
        if (sign == '=') {
            restaurant.budget = parseFloat(amount);
            output = `New budget of restaurant: ${restaurant.budget}`;
        } else if (sign == '-') {
            restaurant.budget -= parseFloat(amount);
            output = `Budget of restaurant was reduced by: ${amount}, new budget is: ${restaurant.budget}`;
        } else if (sign == '+') {
            restaurant.budget += parseFloat(amount);
            output = `Budget of restaurant was increased by: ${amount}, new budget is: ${restaurant.budget}`;
        }
    }

    return output;
}
