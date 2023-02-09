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

    if (args.length > 0) {
        const orderList: string[] = [];
        const command: string[] = [];
        if (args.length % 3 != 0) {
            return 'You have to pass a proper input (Command), (CUSTOMER NAME), (FOOD ORDER)';
        } else {
            for (let index = 0; index < args.length; index++) {
                if (index % 3 == 0) {
                    if (args[index].toLowerCase() != 'Buy'.toLowerCase()) {
                        throw new Error('Unknown command');
                    } else {
                        command.push(args[index]);
                    }
                }
                if (index % 3 == 1) {
                    customerList.push(args[index]);
                } else if (index % 3 == 2) {
                    orderList.push(args[index]);
                }
            }
        }
        for (let index = 0; index < customerList.length; index++) {
            const result = takeOrder(command[index], customerList[index], orderList[index], customers, food, baseIngredients);
            finalOutput.push(result as string);
        }
    } else {
        const input = inputParser('./src/txt_files/input.txt');
        for (let index = 0; index < input.length; index++) {
            const result = takeOrder(input[index][0], input[index][1], input[index][2], customers, food, baseIngredients);
            finalOutput.push(result as string);
        }
    }
    return finalOutput;
}
console.log(main());
console.log(main('dupa', 'sth'));
