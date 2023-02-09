import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';

export function takeOrder(customerName: string, order: string, customers: ICustomerAlergies[], food: IFood[], baseIngredients: IBaseIngredients[]) {
    const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === customerName.toLowerCase());
    const alergies = specificCustomer?.alergies;
    const matching: string[] = [];
    //Add variable to store information about total cost of order, set initial value to 0;
    let orderCost: number = 0;
    if (specificCustomer == undefined) {
        return `Sorry we can't handle your request ${customerName}, we don't know about your alergies.`;
    } else {
        if (!food.find(x => x.name.toLowerCase().includes(order.toLowerCase()))) {
            return `Sorry we don't serve: ${order}`;
        } else {
            const orderedFood = food.find(x => x.name.toLowerCase().includes(order.toLowerCase()));
            const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);
            if (orderedFoodIngredients != undefined) {
                while (orderedFoodIngredients.length > 0) {
                    const baseIngredient = baseIngredients.find(x => x.name === orderedFoodIngredients[0]);
                    if (baseIngredient) {
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
                const matchingAlergies = alergies.some(x => matching.includes(x));
                const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
                if (matchingAlergies) {
                    return [`${specificCustomer.customerName} - ${orderedFood?.name}: can't order, alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}`, orderCost];
                } else if (!matchingAlergies) {
                    return [`${specificCustomer.customerName} - ${orderedFood?.name}: success`, orderCost];
                }
            }
        }
    }
}
