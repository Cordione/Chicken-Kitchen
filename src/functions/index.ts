import { IRestaurant } from '../Interface/IRestaurant';
import { createReport } from './createReport';
import { baseIngredientsParser } from './parsers/baseIngredientsParser';
import { customersParser } from './parsers/customersParser';
import { foodParser } from './parsers/foodParser';
import { inputParser } from './parsers/inputParser';
import { takeOrder } from './takeOrder';

export function main(...args: string[]) {
    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const customerList: string[] = [];
    //If we would wish to have args input
    const finalOutput: string[] = [];
    const restaurant: IRestaurant = {
        budget: 500,
    };
    const restaurantBudgetIterations: number[] = [];
    restaurantBudgetIterations.push(restaurant.budget);
    if (args.length > 0) {
        const orderList: string[] = [];
        const command: string[] = [];
        if (args.length % 3 != 0) {
            return 'You have to pass a proper input (Command), (CUSTOMER NAME), (FOOD ORDER)';
        } else {
            // -Third parameter must be a numeric value greater than 0
            // -If is not a numeric value or lower than 0 throw error

            // - Third parameter must be numeric value can be positive or negative.

            for (let index = 0; index < args.length; index++) {
                if (index % 3 == 0) {
                    if (args[index].toLowerCase() != 'Buy'.toLowerCase() && args[index].toLowerCase() != 'Order'.toLowerCase() && args[index].toLowerCase() != 'Budget'.toLowerCase()) {
                        throw new Error('Unknown command');
                    } else {
                        command.push(args[index]);
                    }
                }

                if (index % 3 == 1) {
                    if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'buy'.toLowerCase()) {
                        customerList.push(args[index]);
                    } else if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'Order'.toLowerCase()) {
                        // If command equals to "Order":
                        // -Ensure that second parameter case insensitive exist in base ingredients array
                        // -If no throw error.
                        if (baseIngredients.find(ingredient => ingredient.name.toLowerCase() == args[index])) {
                            //customerList is supposed to be renamed, have no clue how to call it right now, but leaving it as check mark.
                            customerList.push(args[index]);
                        } else {
                            throw new Error('You want to order unknown ingredient');
                        }
                    } else if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'budget'.toLowerCase()) {
                        //Right now to be skipped, focusing on ORDER.
                        // If commands equals to "Budget":
                        // - Second parameter must equal to one of those "=", "-", "+"
                    }
                } else if (index % 3 == 2) {
                    const isProperNumber = parseInt(args[index]);
                    if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'buy'.toLowerCase()) {
                        orderList.push(args[index]);
                    } else if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'Order'.toLowerCase() && !isNaN(isProperNumber) && isProperNumber > 0) {
                        orderList.push(args[index])
                    } else if (command[Math.ceil(index / 3) - 1].toLowerCase() == 'budget'.toLowerCase()) {
                    }
                }
            }
        }

        for (let index = 0; index < customerList.length; index++) {
            const result = takeOrder(command[index], customerList[index], orderList[index], customers, food, baseIngredients, restaurant);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    } else {
        const input = inputParser('./src/txt_files/input.txt');
        for (let index = 0; index < input.length; index++) {
            const result = takeOrder(input[index][0], input[index][1], input[index][2], customers, food, baseIngredients, restaurant);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    }
    createReport(restaurantBudgetIterations, finalOutput);
    return finalOutput;
}
// console.log(main());
console.log(main('buy', 'Adam Smith', 'Fries', 'buy', 'alexandra smith', 'Princess Chicken', 'order', 'tuna', '5'));
