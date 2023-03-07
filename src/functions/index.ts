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
import { IObjectInWarehouse } from '../Interface/IObjectInWarehouse';
import { createAudit } from './createAudit';
import { saveFile } from './saveFile';
import { commandJSONFileOutput } from './utils/commandJSONFileOutput';
import { ICommands } from '../Interface/ICommands';
// import * as commands from '../json/commands.json';

export function main(initialString?: string, jsonSource?: string) {
    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const warehouse = warehouseParser('./src/csv_files/warehouse.csv', baseIngredients);
    const finalOutput: string[] = [];
    const restaurant: IRestaurant = {
        budget: 500,
    };
    const warehouseStates: IObjectInWarehouse[][] = [];
    const budget: number[] = [];
    const restaurantBudgetIterations: number[] = [];
    const command: string[] = [];
    let auditOutput: string[] = [];
    let commandOutput: ICommands = commandJSONFileOutput(jsonSource);
    let input: ICommandAndParameters[] = [];

    if (initialString != undefined) {
        input = commandTokenizer(initialString, baseIngredients);
    } else if (initialString == undefined) {
        input = inputParser('./src/txt_files/input.txt', baseIngredients);
    }

    for (let index = 0; index < input.length; index++) {
        const result = takeOrder(input[index], customers, food, baseIngredients, restaurant, warehouse, commandOutput);
        const warehouseState: IObjectInWarehouse[] = [];

        for (let idx = 0; idx < warehouse.length; idx++) {
            warehouseState.push({ name: warehouse[idx].name, quantity: warehouse[idx].quantity });
        }

        restaurantBudgetIterations.push(restaurant.budget);
        budget.push(restaurant.budget);
        command.push(`${input[index].command} ${input[index].parameters}`);
        warehouseStates.push(warehouseState);
        if (input[index].command.toLowerCase() != 'Audit'.toLowerCase()) {
            finalOutput.push(result as string);
        }
        if (input[index].command.toLowerCase() == 'Audit'.toLowerCase() && input[index].parameters != undefined && input[index].parameters[0].toLowerCase() == 'Resources'.toLowerCase()) {
            auditOutput = createAudit(finalOutput, warehouseStates, budget);
        }
    }
    if (commandOutput.audit == 'yes') {
        saveFile(auditOutput, './src/reports/Audit.txt');
    }
    createReport(restaurantBudgetIterations, finalOutput);
    return finalOutput;
}
// console.log(main());
// console.log(main(`Buy, Julie Mirage, Princess Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries`));
console.log(main(`Buy, Adam Smith, Princess Chicken\nBuy, Adam Smith, Princess Chicken\nBuy, Alexandra Smith, Emperor Chicken\n Audit, Resources`, '../../json/allEnabled.json'));
