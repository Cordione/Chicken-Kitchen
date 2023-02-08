import { IBaseIngredients } from '../Interface/IBaseIngredients';
import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';


export function takeOrder(customerName: string, order: string, customers: ICustomerAlergies[], food: IFood[], baseIngredients: IBaseIngredients[]) {
    // const customers = customersParser('./src/csv_files/customersAlergies.csv');
    // const food = foodParser('./src/csv_files/food.csv');
    // const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === customerName.toLowerCase());
    const alergies = specificCustomer?.alergies;
    const matching: string[] = [];
    // console.log(specificCustomer);
    if (specificCustomer == undefined) {
        return `Sorry we can't handle your request ${customerName}, we don't know about your alergies.`;
    } else {
        if (!food.find(x => x.name.toLowerCase().includes(order.toLowerCase()))) {
            return `Sorry we don't serve: ${order}`;
        } else {
            const orderedFood = food.find(x => x.name.toLowerCase().includes(order.toLowerCase()));
            const orderedFoodIngredients = orderedFood?.ingerdients;
            const baseIngredient = baseIngredients.map(x => x.name);
            if (orderedFoodIngredients != undefined) {
                while (orderedFoodIngredients.length > 0) {
                    if (baseIngredient.includes(orderedFoodIngredients[0])) {
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
                if (alergies != undefined) {
                    const matchingAlergies = alergies.some(x => matching.includes(x));
                    const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
                    if (matchingAlergies) {
                        return `${specificCustomer.customerName} - ${orderedFood?.name}: can't order, alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}`;
                    } else {
                        return `${specificCustomer.customerName} - ${orderedFood?.name}: success`;
                    }
                }
            }
        }
    }
}
