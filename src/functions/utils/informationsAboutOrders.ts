import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { foodParser } from '../parsers/foodParser';

export function informationsAboutOrders(commandAndParameters: ICommandAndParameters, customers: ICustomerAlergies[], food: IFood[], baseIngredients: IBaseIngredients[]) {
    const specificOrders: ISpecificOrder[] = [];
    const isAlergicTo: string[][] = [];
    const orderedUnavailableFood: string[] = [];
    if (commandAndParameters.parameters != undefined) {
        const halfOfTheArray: number = Math.floor(commandAndParameters.parameters?.length / 2);
        for (let i = 0; i < halfOfTheArray; i++) {
            const specific = commandAndParameters.parameters[i];
            const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
            const matching: string[] = [];
            const alergies = specificCustomer?.alergies;
            const specificOrder = commandAndParameters.parameters[halfOfTheArray + i];
            // if (!food.find(x => x.name.toLowerCase() === specificOrder.toLowerCase())) {
            //     orderedUnavailableFood.push(`Sorry we don't serve: ${specificOrder}`);
            // } else {
            let orderCost: number = 0;
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
            specificOrders.push({ name: specificOrder, price: orderCost });
            const listOfMatchingAlergies = alergies?.filter(x => matching.includes(x));
            if (listOfMatchingAlergies != undefined) {
                isAlergicTo.push(listOfMatchingAlergies);
            }
        }
    }
    return [specificOrders, isAlergicTo, orderedUnavailableFood];
}
