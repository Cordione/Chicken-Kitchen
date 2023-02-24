import { ICommandAndParameters } from '../Interface/ICommandAndParameters';
import { IRestaurant } from '../Interface/IRestaurant';
import { createReport } from './createReport';
import { baseIngredientsParser } from './parsers/baseIngredientsParser';
import { customersParser } from './parsers/customersParser';
import { foodParser } from './parsers/foodParser';
import { inputParser } from './parsers/inputParser';
import { inputParserWithoutFile } from './parsers/inputParserWithoutFile';
import { takeOrder } from './takeOrder';

export function main(initialString?: string) {
    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const finalOutput: string[] = [];
    const restaurant: IRestaurant = {
        budget: 500,
    };
    const restaurantBudgetIterations: number[] = [];
    if (initialString != undefined) {
        const commandAndParameters: ICommandAndParameters[] = inputParserWithoutFile(initialString, baseIngredients);
        restaurantBudgetIterations.push(restaurant.budget);
        for (let index = 0; index < commandAndParameters.length; index++) {
            const result = takeOrder(commandAndParameters[index], customers, food, baseIngredients, restaurant);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    } else {
        const input: ICommandAndParameters[] = inputParser('./src/txt_files/input.txt');
        for (let index = 0; index < input.length; index++) {
            const result = takeOrder(input[index], customers, food, baseIngredients, restaurant);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    }
    createReport(restaurantBudgetIterations, finalOutput);
    return finalOutput;
}
console.log(main());
// console.log(main(`buy, Adam Smith, Fries\nbuy, alexandra smith, Princess Chicken\norder, tuna, 5\nbudget, +, 15`));
// console.log(main('budget', '=', '50', 'budget', '-', '50', 'budget', '+', '50'));
