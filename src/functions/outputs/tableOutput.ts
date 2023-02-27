import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { customersParser } from '../parsers/customersParser';
import { foodParser } from '../parsers/foodParser';

export function tableOutput(commandAndParameters: ICommandAndParameters, customerList: ICustomerAlergies[], food: IFood[], baseIngredients: IBaseIngredients[], restaurantMarkup: number) {
    //Should work properly for multiple customers
    //which guests want to take table:
    const customers: ICustomerAlergies[] = [];
    if (commandAndParameters.parameters != undefined) {
        const foodList: string[] = [];
        const halfOfTheArray: number = Math.floor(commandAndParameters.parameters?.length / 2);
        for (let index = 0; index < halfOfTheArray; index++) {
            const specific = commandAndParameters.parameters[index];
            const specificCustomer = customerList.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
            if (specificCustomer != undefined) {
                customers.push(specificCustomer);
            }
        }
        const unqiueCustomers = [...new Set(customers)];

        // for (let index = halfOfTheArray; index < commandAndParameters.parameters.length; index++) {
        //     foodList.push(commandAndParameters.parameters[index]);
        // }
        // //verify if any of customers is alergic to ordered food
        // const specificOrders: ISpecificOrder[] = [];
        // const haveAlergiesForOrderedFood: [][] = [];

        // for (let i = 0; i < halfOfTheArray; i++) {
        //     const specific = commandAndParameters.parameters[i];
        //     const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
        //     const matching: string[] = [];
        //     const alergies = specificCustomer?.alergies;
        //     const specificOrder = commandAndParameters.parameters[halfOfTheArray + i];

        //     if (!food.find(x => x.name.toLowerCase() === specificOrder.toLowerCase())) {
        //         return `Sorry we don't serve: ${specificOrder}`;
        //     } else {
        //         let orderCost: number = 0;
        //         const orderedFood = food.find(x => x.name.toLowerCase().includes(specificOrder.toLowerCase())) as IFood;
        //         const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);

        //         if (orderedFoodIngredients != undefined) {
        //             while (orderedFoodIngredients.length > 0) {
        //                 const baseIngredient = baseIngredients.find(x => x.name === orderedFoodIngredients[0]);
        //                 if (baseIngredient) {
        //                     //update order cost based on removed ingredient
        //                     orderCost += baseIngredient.cost;
        //                     matching.push(orderedFoodIngredients[0]);
        //                 } else {
        //                     const subIngredient = food.find(x => x.name === orderedFoodIngredients[0]);
        //                     const subIngredientIng = subIngredient?.ingerdients;
        //                     if (subIngredientIng != undefined) {
        //                         for (const ingerdient of subIngredientIng) {
        //                             orderedFoodIngredients.push(ingerdient);
        //                         }
        //                     }
        //                 }
        //                 orderedFoodIngredients.splice(0, 1);
        //             }
        //         }
        //         const listOfMatchingAlergies = alergies?.filter(x => matching.includes(x));
        //         console.log(listOfMatchingAlergies)
        //         // haveAlergiesForOrderedFood.push(listOfMatchingAlergies)
        //         // orderCost *= restaurantMarkup

        //         specificOrders.push({ name: specificOrder, price: orderCost });
        //         //one of customers is alergic to one or more ingredients
        //         if (halfOfTheArray - commandAndParameters.parameters.filter(x => x != '').length / 2 == 0) {
        //             //one of customers is allergic to ordered food
        //             const outputList: string[] = [];
        //             if (listOfMatchingAlergies != undefined && listOfMatchingAlergies.length > 0 && specificCustomer != undefined) {
        //                 const customersNames = customers.map(x => x.customerName);
        //                 outputList.push(`Customers: ${customersNames.join(', ')} wants to order: ${foodList.join(', ')}. Failure.\n`);
        //                 for (let index = 0; index < customers.length; index++) {
        //                     if (index == 0) {
        //                         outputList.push(`{\n`);
        //                     }
        //                     if (customers[index].customerName == specificCustomer.customerName) {
        //                         outputList.push(
        //                             `We're sorry: ${customers[index].customerName}, we cannot provide you with table, becouse you're alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}\n`
        //                         );
        //                     }
        //                     if (customers[index].customerName != specificCustomer.customerName) {
        //                         outputList.push(`We're sorry ${customers[index].customerName}, we cannot provide you with table, becouse other guest is alergic to his order\n`);
        //                     }
        //                     if (index + 1 == customers.length) {
        //                         outputList.push('}');
        //                     }
        //                 }
        //                 return outputList.join('');
        //             } else if (unqiueCustomers.length != customers.length) {
        //                 //each customer can appear only once @ table
        //                 return `ERROR. One person can appear only once at the table.`;
        //             }

        //             //  else if (listOfMatchingAlergies != undefined && listOfMatchingAlergies.length == 0 && specificCustomer != undefined) {
        //             //     //Our customer is not alergic
        //             //     //Time to check if everyone can pay
        //             //     for (let i = 0; i < halfOfTheArray; i++) {
        //             //         const specific = commandAndParameters.parameters[i];
        //             //         const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
        //             //         const specificOrder = commandAndParameters.parameters[halfOfTheArray + i];
        //             //         console.log(specificOrder)
        //             //         console.log()
        //             //     }

        //             //     const totalCostOfOrders: number[] = [];
        //             //     const canPay: boolean[] = [];
        //             //     if (specificCustomer.budget >= orderCost) {
        //             //         canPay.push(true);
        //             //     } else {
        //             //         canPay.push(false);
        //             //     }
        //             //     totalCostOfOrders.push(orderCost);
        //             //     const everyoneCanPay = canPay.every(x => x == true);
        //             //     if (everyoneCanPay) {
        //             //         const customersNames = customers.map(x => x.customerName);
        //             //         outputList.push(`Customers: ${customersNames.join(', ')} wants to order: ${foodList.join(', ')}. Success. Total cost: .\n`);
        //             //         for (let index = 0; index < customers.length; index++) {
        //             //             if (index == 0) {
        //             //                 outputList.push(`{\n`);
        //             //             }
        //             //             if (customers[index].customerName == specificCustomer.customerName) {
        //             //                 outputList.push(``);
        //             //             }
        //             //             if (customers[index].customerName != specificCustomer.customerName) {
        //             //                 outputList.push(`We're sorry ${customers[index].customerName}, we cannot provide you with table, becouse other guest is alergic to his order\n`);
        //             //             }
        //             //             if (index + 1 == customers.length) {
        //             //                 outputList.push('}');
        //             //             }
        //             //         }
        //             //         return outputList.join('');
        //             //     }
        //             //     console.log(everyoneCanPay);
        //         }
        //     }
        // }


        // if (halfOfTheArray - commandAndParameters.parameters.length / 2 != 0) {
        //     //More ppl than food
        //     if (halfOfTheArray - commandAndParameters.parameters.length / 2 > 0) {
        //         return `ERROR. Every person needs something to eat.`;
        //     }
        //     //More food than ppl
        //     if (halfOfTheArray - commandAndParameters.parameters.length / 2 < 0) {
        //         return `ERROR. One person can have one type of food only.`;
        //     }
        // }
    }
}

// console.log(
//     tableOutput(
//         { command: 'table', parameters: ['Bernard Unfortunate', 'Julie Mirage', 'Fries', 'Princess Chicken'] },
//         customersParser('./src/csv_files/customersAlergies.csv'),
//         foodParser('./src/csv_files/food.csv'),
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
//         1.3
//     )
// );
// console.log(
//     tableOutput(
//         { command: 'table', parameters: ['Alexandra Smith', 'Adam Smith', 'Fries', 'Princess Chicken'] },
//         customersParser('./src/csv_files/customersAlergies.csv'),
//         foodParser('./src/csv_files/food.csv'),
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
//         1.3
//     )
// );
console.log(
    tableOutput(
        { command: 'table', parameters: ['Adam Smith', 'Alexandra Smith', 'Fries', 'Princess Chicken'] },
        customersParser('./src/csv_files/customersAlergies.csv'),
        foodParser('./src/csv_files/food.csv'),
        baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
        1.3
    )
);
