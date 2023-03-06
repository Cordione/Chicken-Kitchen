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
    //Add variable to store information about total cost of order, set initial value to 0;
    if (restaurant.budget >= 0) {
        const restaurantMarkup: number = 1.3;
        if (commandAndParameters.command.toLowerCase() == 'buy'.toLowerCase() && commandAndParameters.parameters != undefined) {
            const specific = commandAndParameters.parameters[0];
            const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
            const alergies = specificCustomer?.alergies;
            if (specificCustomer == undefined) {
                return `Sorry we can't handle your request ${specific}, we don't know about your alergies.`;
            } else {
                const specificOrder = commandAndParameters.parameters[1];
                if (!food.find(x => x.name.toLowerCase().includes(specificOrder.toLowerCase()))) {
                    return `Sorry we don't serve: ${specificOrder}`;
                } else {
                    let orderCost: number = 0;
                    const orderedFood = food.find(x => x.name.toLowerCase().includes(specificOrder.toLowerCase())) as IFood;
                    const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);
                    const matching: string[] = [];
                    if (orderedFoodIngredients != undefined) {
                        while (orderedFoodIngredients.length > 0) {
                            const baseIngredient = baseIngredients.find(x => x.name === orderedFoodIngredients[0]);
                            if (baseIngredient) {
                                //update order cost based on removed ingredient
                                orderCost += baseIngredient.cost;
                                matching.push(orderedFoodIngredients[0]);
                            } else {
                                const subIngredient = food.find(x => x.name === orderedFoodIngredients[0]);
                                const subIngredientIng = subIngredient?.ingerdients;
                                if (subIngredientIng != undefined) {
                                    for (const ingerdient of subIngredientIng) {
                                        orderedFoodIngredients.push(ingerdient);
                                    }
                                }
                            }
                            orderedFoodIngredients.splice(0, 1);
                        }
                    }
                    if (alergies != undefined) {
                        //Restaurant Markup
                        orderCost *= restaurantMarkup;
                        const output = buyOutput(alergies, specificCustomer, orderedFood, orderCost, matching, restaurant);
                        return output;
                    }
                }
            }
        }
        if (commandAndParameters.command.toLowerCase() == 'order'.toLowerCase() && commandAndParameters.parameters != undefined) {
            //Find matching element price, store it, multiply it by amount of orders
            const output = orderOutput(commandAndParameters, baseIngredients, restaurant);
            return output;
        }
        if (commandAndParameters.command.toLowerCase() == 'budget'.toLowerCase() && commandAndParameters.parameters != undefined) {
            const output = budgetOutput(commandAndParameters, restaurant);
            return output;
        }
        if (commandAndParameters.command.toLowerCase() == 'table'.toLowerCase()) {
            const output = tableOutput(commandAndParameters, customers, food, baseIngredients, restaurantMarkup, restaurant, warehouse);
            return output;
        }
    }
    if (restaurant.budget < 0) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        return `RESTAURANT BANKRUPT`;
    }
}
