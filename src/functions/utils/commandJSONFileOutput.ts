import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { setDefaultJsonStates } from './setDefaultJsonStates';
export function commandJSONFileOutput(jsonSource?: string) {
    let src;
    if (jsonSource == undefined || jsonSource == '') {
        src = require(`../../json/allEnabled.json`);
    } else {
        src = require(jsonSource);
    }
    src.everyThirdDiscount = src['every third discount'];
    src.profitMargin = src['profit margin'];
    src.transactionTax = src['transaction tax'];
    src.dailyTax = src['daily tax'];
    src.everyThirdDiscount = src['every third discount'];
    src.totalMaximum = src['total maximum'];
    src.maxIngredientType = src['max ingredient type'];
    src.maxDishType = src['max dish type'];
    src.dishWithAllergies = src['dishes with allergies'];
    src.spoilRate = src['spoil rate'];
    src.wasteLimit = src['waste limit'];
    src.maxTip = src['max tip'];
    src.orderIngredientVolatility = src['order ingredient volatility'];
    src.orderDishVolatility = src['order dish volatility'];
    src.tipsTax = src['tips tax'];
    src.wasteTax = src['waste tax'];
    const commandOutput: IInformationsFromJsonFile = src;
    setDefaultJsonStates(commandOutput);
    return commandOutput;
}
// console.log(commandJSONFileOutput(`../../json/tax`));
