import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';
import { IRestaurant } from '../Interface/IRestaurant';
import { possibleOutputs } from './possibleOutputs';

export function takeOrder(commandAndParameters: ICommandAndParameters, customers: ICustomerAlergies[], food: IFood[], baseIngredients: IBaseIngredients[], restaurant: IRestaurant) {
    const matching: string[] = [];
    //Add variable to store information about total cost of order, set initial value to 0;
    let orderCost: number = 0;
    if (restaurant.budget >= 0) {
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
                    const orderedFood = food.find(x => x.name.toLowerCase().includes(specificOrder.toLowerCase())) as IFood;
                    const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);
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
                        orderCost *= 1.3;
                        const output = possibleOutputs(commandAndParameters.command, alergies, specificCustomer, orderedFood, orderCost, matching, restaurant);
                        return output;
                    }
                }
            }
        }
        if (commandAndParameters.command.toLowerCase() == 'order'.toLowerCase() && commandAndParameters.parameters != undefined) {
            //Find matching element price, store it, multiply it by amount of orders
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
        if (commandAndParameters.command.toLowerCase() == 'budget'.toLowerCase() && commandAndParameters.parameters != undefined) {
            const sign = commandAndParameters.parameters[0];
            const amount = commandAndParameters.parameters[1];
            if (sign == '=') {
                restaurant.budget = parseFloat(amount);
                return `New budget of restaurant: ${restaurant.budget}`;
            } else if (sign == '-') {
                restaurant.budget -= parseFloat(amount);
                return `Budget of restaurant was reduced by: ${amount}, new budget is: ${restaurant.budget.toFixed(2)}`;
            } else if (sign == '+') {
                restaurant.budget += parseFloat(amount);
                return `Budget of restaurant was increased by: ${amount}, new budget is: ${restaurant.budget.toFixed(2)}`;
            }
        }
    }
    if (restaurant.budget < 0) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        return `RESTAURANT BANKRUPT`;
    }
}
