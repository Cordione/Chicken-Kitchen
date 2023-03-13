import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/allEnabled.json`);
    } else {
        src = require(jsonSource);
    }
    src.everyThirdDiscount = src["every third discount"];
    src.profitMargin = src['profit margin'];
    src.transactionTax = src['transaction tax'];
    src.dailyTax = src['daily tax'];
    src.everyThirdDiscount = src['every third discount'];
    src.totalMaximum = src['total maximum'];
    src.maxIngredientType = src['max ingredient type'];
    src.maxDishType = src['max dish type'];
    const commandOutput: IInformationsFromJsonFile = src;
    return commandOutput;
}
// console.log(commandJSONFileOutput(`../../json/tax`));
// console.log(commandJSONFileOutput())
