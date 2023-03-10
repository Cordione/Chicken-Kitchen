import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/allEnabled.json`);
    } else {
        src = require(jsonSource);
    }
    src.profitMargin = src["profit margin"];
    src.transactionTax = src["transaction tax"];
    src.dailyTax = src["daily tax"];
    src.everyThirdDiscount = src["every third discount"];
    const commandOutput: IInformationsFromJsonFile = src;
    return commandOutput;
}
// console.log(commandJSONFileOutput(`../../json/tax`));
// console.log(commandJSONFileOutput())
