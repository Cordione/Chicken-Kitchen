import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';
import { IRestaurant } from '../Interface/IRestaurant';
import { possibleOutputs } from './possibleOutputs';

export function takeOrder(
    command: string,
    customerIngredientSign: string,
    orderQuantity: string,
    customers: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurant: IRestaurant
) {
    const matching: string[] = [];
    //Add variable to store information about total cost of order, set initial value to 0;
    let orderCost: number = 0;
    if (restaurant.budget >= 0) {
        if (command.toLowerCase() == 'buy'.toLowerCase()) {
            const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === customerIngredientSign.toLowerCase());
            const alergies = specificCustomer?.alergies;
            if (specificCustomer == undefined) {
                return `Sorry we can't handle your request ${customerIngredientSign}, we don't know about your alergies.`;
            } else {
                if (!food.find(x => x.name.toLowerCase().includes(orderQuantity.toLowerCase()))) {
                    return `Sorry we don't serve: ${orderQuantity}`;
                } else {
                    const orderedFood = food.find(x => x.name.toLowerCase().includes(orderQuantity.toLowerCase())) as IFood;
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
                        const output = possibleOutputs(command, alergies, specificCustomer, orderedFood, orderCost, matching, restaurant);
                        return output;
                    }
                }
            }
        }
        if (command.toLowerCase() == 'order'.toLowerCase()) {
            //Find matching element price, store it, multiply it by amount of orders
            const singleUnit = baseIngredients.find(ingredient => {
                if (ingredient.name.toLowerCase() == customerIngredientSign.toLowerCase()) {
                    return ingredient.cost;
                }
            });
            //Reduce restaurant budget by recived order
            restaurant.budget -= singleUnit!.cost * parseFloat(orderQuantity);
            return `We ordered ${parseFloat(orderQuantity)}x ${customerIngredientSign} and current restaurant budget is ${restaurant.budget.toFixed(2)}`;
        }
        if (command.toLowerCase() == 'budget'.toLowerCase()) {
            if (customerIngredientSign == '=') {
                restaurant.budget = parseFloat(orderQuantity);
                return `New budget of restaurant: ${restaurant.budget}`;
            } else if (customerIngredientSign == '-') {
                restaurant.budget -= parseFloat(orderQuantity);
                return `Budget of restaurant was reduced by: ${orderQuantity}, new budget is: ${restaurant.budget.toFixed(2)}`;
            } else if (customerIngredientSign == '+') {
                restaurant.budget += parseFloat(orderQuantity);
                return `Budget of restaurant was increased by: ${orderQuantity}, new budget is: ${restaurant.budget.toFixed(2)}`;
            }
        }
    }
    if (restaurant.budget < 0) {
        //If restaurant budget happends to be bellow 0 at any time, we declare it bankrupt, no future orders are realized/reported
        return `RESTAURANT BANKRUPT`;
    }
}
