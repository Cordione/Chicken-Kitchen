import { baseIngredientsParser } from './parsers/baseIngredientsParser';
import { customersParser } from './parsers/customersParser';
import { foodParser } from './parsers/foodParser';
import { takeOrder } from './takeOrder';

export function main(...args: string[]) {
    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const customerList: string[] = [];
    const orderList: string[] = [];
    const finalOutput: string[] = [];
    if (args.length % 2 != 0) {
        return 'You have to pass a proper input (CUSTOMER NAME), (FOOD ORDER)';
    } else {
        for (let index = 0; index < args.length; index++) {
            if (index % 2 == 0) {
                customerList.push(args[index]);
            } else if (index % 2 == 1) {
                orderList.push(args[index]);
            }
        }
    }
    for (let index = 0; index < customerList.length; index++) {
        const result = takeOrder(customerList[index], orderList[index], customers, food, baseIngredients)
        finalOutput.push(result as string)
    }
    return finalOutput
}
