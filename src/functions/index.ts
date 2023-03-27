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
import { updateWarehouseStateAndReturnWhatWasWasted } from './utils/updateWarehouseState';
import { checkRestaurantState } from './utils/checkRestaurantState';
import { unifyTrash } from './utils/unifyTrash';
import { createWastePool } from './createWastePool';
// import * as commands from '../json/commands.json';

export function main(initialString?: string, jsonSource?: string) {
    let informationsFromJsonFile: IInformationsFromJsonFile = commandJSONFileOutput(jsonSource);

    const customers = customersParser('./src/csv_files/customersAlergies.csv');
    const food = foodParser('./src/csv_files/food.csv');
    const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
    const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', baseIngredients, informationsFromJsonFile);
    const finalOutput: string[] = [];
    const restaurant: IRestaurant = {
        budget: 500,
        isPoisoned: false,
    };

    let trash: IObjectInWarehouse[][] = [];
    const totalTrash: IObjectInWarehouse[][] = [];
    const warehouseStates: IObjectInWarehouse[][] = [];
    const budget: number[] = [];
    const whatWasWasted: IObjectInWarehouse[][] = [];
    const command: string[] = [];
    const taxPaid: number[] = [];
    const tips: number[] = [];
    let auditOutput: string[] = [];
    let input: ICommandAndParameters[] = [];
    const auditArray: string[] = [];
    auditArray.push('');
    budget.push(restaurant.budget);

    if (initialString != undefined) {
        input = commandTokenizer(initialString, baseIngredients);
    } else if (initialString == undefined) {
        input = inputParser('./src/txt_files/input.txt', baseIngredients);
    }
    //initial waste
    const warehouseState: IObjectInWarehouse[] = [];

    const wastedMaterials = updateWarehouseStateAndReturnWhatWasWasted(warehouse, baseIngredients, food, informationsFromJsonFile);
    if (wastedMaterials.length > 0) {
        whatWasWasted.push(wastedMaterials);
        trash.push(wastedMaterials);
    } else {
        whatWasWasted.push([{ name: 'None', quantity: 0 }]);
    }
    for (let idx = 0; idx < warehouse.length; idx++) {
        warehouseState.push({ name: warehouse[idx].name, quantity: warehouse[idx].quantity });
    }

    for (let index = 0; index < input.length; index++) {
        const warehouseState: IObjectInWarehouse[] = [];
        let wastedMaterials: IObjectInWarehouse[] = [];

        for (let idx = 0; idx < warehouse.length; idx++) {
            warehouseState.push({ name: warehouse[idx].name, quantity: warehouse[idx].quantity });
        }
        const result = takeOrder(input[index], customers, food, baseIngredients, restaurant, warehouse, informationsFromJsonFile);
        if (input[index].command.toLowerCase() != 'Audit'.toLowerCase() && input[index].command.toLowerCase() != 'throw trash away'.toLowerCase()) {
            if (result?.length == 5) {
                finalOutput.push(result[0] as string);
                if (!isNaN(result[1] as number)) taxPaid.push(result[1] as number);
                trash.push(result[2] as IObjectInWarehouse[]);
                wastedMaterials = result[3] as IObjectInWarehouse[];
                if (!isNaN(result[4] as number)) tips.push(result[4] as number);
            } else if (result?.length == 4) {
                finalOutput.push(result[0] as string);
                if (!isNaN(result[1] as number)) taxPaid.push(result[1] as number);
                trash.push(result[2] as IObjectInWarehouse[]);
                wastedMaterials = result[3] as IObjectInWarehouse[];
            } else if (result?.length == 3) {
                finalOutput.push(result[0] as string);
                if (!isNaN(result[1] as number)) taxPaid.push(result[1] as number);
                trash.push(result[2] as IObjectInWarehouse[]);
            } else if (result?.length == 2) {
                finalOutput.push(result[0] as string);
                if (!isNaN(result[1] as number)) taxPaid.push(result[1] as number);
            } else {
                finalOutput.push(result as string);
                taxPaid.push(0);
            }
        }
        if (input[index].command.toLowerCase() == 'Order'.toLowerCase()) {
            wastedMaterials = updateWarehouseStateAndReturnWhatWasWasted(warehouse, baseIngredients, food, informationsFromJsonFile);
        }
        if (wastedMaterials.length > 0) {
            whatWasWasted.push(wastedMaterials);
            trash.push(wastedMaterials);
        } else {
            whatWasWasted.push([{ name: 'None', quantity: 0 }]);
        }
        checkRestaurantState(restaurant, food, trash, informationsFromJsonFile);
        budget.push(restaurant.budget);
        command.push(`${input[index].command} ${input[index].parameters}`);
        warehouseStates.push(warehouseState);

        if (input[index].command.toLowerCase() == 'Audit'.toLowerCase() && input[index].parameters != undefined && input[index].parameters[0].toLowerCase() == 'Resources'.toLowerCase()) {
            finalOutput.map(x => auditArray.push(x as string));
            auditOutput = createAudit(auditArray, warehouseStates, budget, whatWasWasted, informationsFromJsonFile, baseIngredients, food, tips);
        }
        if (input[index].command.toLowerCase() == 'Throw trash away'.toLowerCase()) {
            for (const element of trash) {
                totalTrash.push(element);
            }
            const trashes = unifyTrash(totalTrash);
            createWastePool(trashes, './src/reports/WastePool.txt');
            const thrownAway: string[] = [];
            for (const el of trash.flat()) {
                thrownAway.push(`${el.name}, ${el.quantity}`);
            }
            finalOutput.push(`We thrown away this time ${thrownAway.join(', ')}`);
            trash = [];
        }
    }

    //count taxes
    const totalTaxPaid = taxPaid.reduce((a, b) => a + b, 0);
    const totalTips = tips.flat().reduce((a, b) => a + b, 0);
    const taxableProfit = countTaxableProfit(totalTaxPaid, budget, totalTips);
    const dailyTaxAmount = taxesToPay(taxableProfit, informationsFromJsonFile);
    restaurant.budget - dailyTaxAmount;
    budget.push(restaurant.budget - dailyTaxAmount);
    finalOutput.push(`Daily tax to pay: ${dailyTaxAmount}`);
    if (informationsFromJsonFile.audit == 'yes') {
        saveFile(auditOutput, './src/reports/Audit.txt');
    }
    createReport(budget, finalOutput, whatWasWasted, informationsFromJsonFile, baseIngredients, food);
    return finalOutput;
}
// console.log(main(`buy, bernard unfortunate, fries`));
// console.log(main(`table, adam smith, fries`));
// console.log(main(`buy, adam smith, fries\nbuy, adam smith, fries\nbuy, adam smith, fries`));
console.log(main(`table, adam smith, fries\ntable, adam smith, fries\ntable, adam smith, fries\n Audit, Resources`));
// console.log(main(`order, tuna, 5\norder, tuna, 5\norder, tuna, 5\norder, tuna, 5`));
// console.log(main(`order, potatoes, 30\n order, water, 5`));
// console.log(main(`table, barbara smith, bernard unfortunate, adam smith, tuna cake, fries, fries\n Audit, Resources\nThrow trash away\nOrder, chicken, 1\nthrow trash away`));
// console.log(main(`table, barbara smith, bernard unfortunate, adam smith, tuna cake, fries, fries\n throw trash away`, `../../json/number.json`));
// console.log(main(`Buy, Alexandra Smith, emperor chicken\n order, tuna, 15, princess chicken, 2\n Audit, Resources`, `../../json/all.json`));
// console.log(main(`Buy, Alexandra Smith, emperor chicken\n order, tuna, 2\n Audit, Resources`, `../../json/all.json`));
// console.log(main(`Buy, Alexandra Smith, Emperor Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries`));
// console.log(main(`Buy, Adam Smith, Irish Fish\nBuy, Adam Smith, Fries\n buy, Alexandra Smith, Emperor Chicken\nOrder, tuna, 10\n Audit, Resources`, '../../json/allEnabled.json'));
// console.log(main(`table, Alexandra Smith, Princess Chicken\nBuy, Adam Smith, Fries\n buy, Alexandra Smith, Emperor Chicken\n Audit, Resources`, '../../json/allEnabled.json'));
