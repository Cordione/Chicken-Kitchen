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
import { IInformationsFromJsonFile } from '../Interface/IInformationsFromJsonFIle';
import { countTaxableProfit } from './utils/countTaxableProfit';
import { taxesToPay } from './utils/taxesToPay';
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

    const command: string[] = [];
    const taxPaid: number[] = [];
    let auditOutput: string[] = [];
    let informationsFromJsonFile: IInformationsFromJsonFile = commandJSONFileOutput(jsonSource);
    let input: ICommandAndParameters[] = [];
    const auditArray: string[] = [];
    auditArray.push('');
    budget.push(restaurant.budget);
    if (initialString != undefined) {
        input = commandTokenizer(initialString, baseIngredients);
    } else if (initialString == undefined) {
        input = inputParser('./src/txt_files/input.txt', baseIngredients);
    }

    for (let index = 0; index < input.length; index++) {
        const warehouseState: IObjectInWarehouse[] = [];
        for (let idx = 0; idx < warehouse.length; idx++) {
            warehouseState.push({ name: warehouse[idx].name, quantity: warehouse[idx].quantity });
        }
        const result = takeOrder(input[index], customers, food, baseIngredients, restaurant, warehouse, informationsFromJsonFile);
        budget.push(restaurant.budget);
        command.push(`${input[index].command} ${input[index].parameters}`);
        warehouseStates.push(warehouseState);
        if (input[index].command.toLowerCase() != 'Audit'.toLowerCase()) {
            if (result?.length == 2) {
                finalOutput.push(result[0] as string);
                taxPaid.push(result[1] as number);
            } else {
                finalOutput.push(result as string);
            }
        }
        if (input[index].command.toLowerCase() == 'Audit'.toLowerCase() && input[index].parameters != undefined && input[index].parameters[0].toLowerCase() == 'Resources'.toLowerCase()) {
            finalOutput.map(x => auditArray.push(x as string));
            auditOutput = createAudit(auditArray, warehouseStates, budget);
        }
    }
    const totalTaxPaid = taxPaid.reduce((a, b) => a + b, 0);
    const taxableProfit = countTaxableProfit(totalTaxPaid, budget);
    const dailyTaxAmount = taxesToPay(taxableProfit, informationsFromJsonFile);
    restaurant.budget - dailyTaxAmount
    budget.push(restaurant.budget - dailyTaxAmount)
    finalOutput.push(`Daily tax to pay: ${dailyTaxAmount}`)
    if (informationsFromJsonFile.audit == 'yes') {
        saveFile(auditOutput, './src/reports/Audit.txt');
    }
    createReport(budget, finalOutput);
    return finalOutput;
}
// console.log(main());
// console.log(main(`Buy, Adam Smith, Fries`));
// console.log(main(`Buy, Julie Mirage, Princess Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries`));
console.log(main(`Buy, Adam Smith, Princess Chicken\nBuy, Adam Smith, Princess Chicken\n buy, Alexandra Smith, Emperor Chicken\n Audit, Resources`, '../../json/allEnabled.json'));
// console.log(main(`table, Alexandra Smith, Princess Chicken\nBuy, Adam Smith, Fries\n buy, Alexandra Smith, Emperor Chicken\n Order, Tuna, 5 \n Audit, Resources`, '../../json/allEnabled.json'));
