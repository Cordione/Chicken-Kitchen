import { ICommandAndParameters } from '../Interface/ICommandAndParameters';
import { IRestaurant } from '../Interface/IRestaurant';
import { createReport } from './createReport';
import { baseIngredientsParser } from './parsers/baseIngredientsParser';
import { customersParser } from './parsers/customersParser';
import { foodParser } from './parsers/foodParser';
import { inputParser } from './parsers/inputParser';
import { commandTokenizer } from './parsers/commandTokenizer';
import { takeOrder } from './takeOrder';
import { warehouseParser } from './parsers/warehouseParser';

export function main(initialString?: string) {
    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const warehouse = warehouseParser('./src/csv_files/warehouse.csv', baseIngredients);
    const finalOutput: string[] = [];
    const restaurant: IRestaurant = {
        budget: 500,
    };
    const restaurantBudgetIterations: number[] = [];
    if (initialString != undefined) {
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(initialString, baseIngredients);
        restaurantBudgetIterations.push(restaurant.budget);
        for (let index = 0; index < commandAndParameters.length; index++) {
            const result = takeOrder(commandAndParameters[index], customers, food, baseIngredients, restaurant, warehouse);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    } else {
        const input: ICommandAndParameters[] = inputParser('./src/txt_files/input.txt', baseIngredients);
        for (let index = 0; index < input.length; index++) {
            const result = takeOrder(input[index], customers, food, baseIngredients, restaurant, warehouse);
            restaurantBudgetIterations.push(restaurant.budget);
            finalOutput.push(result as string);
        }
    }
    createReport(restaurantBudgetIterations, finalOutput);
    return finalOutput;
}
// console.log(main(`buy, julie mirage, fries`));
// console.log(main(`Buy, Adam Smith, Princess Chicken\nBuy, Adam Smith, Princess Chicken\nBuy, Julie Mirage, Emperor Chicken\nbuy, alexandra smith, emperor chicken`));
