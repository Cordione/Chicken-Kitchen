import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';

export function setDefaultJsonStates(commandOutput: IInformationsFromJsonFile) {
    commandOutput.audit = commandOutput.audit != undefined ? commandOutput.audit : 'no';
    commandOutput.buy = commandOutput.buy != undefined ? commandOutput.buy : 'no';
    commandOutput.table = commandOutput.table != undefined ? commandOutput.table : 'no';
    commandOutput.budget = commandOutput.budget != undefined ? commandOutput.budget : 'no';
    commandOutput.order = commandOutput.order != undefined ? commandOutput.order : 'no';

    commandOutput.profitMargin = commandOutput.profitMargin != undefined ? parseFloat(`1.${commandOutput.profitMargin}`) : 1.3;
    commandOutput.transactionTax = commandOutput.transactionTax != undefined ? parseFloat(`0.${commandOutput.transactionTax}`) : 0.1;
    commandOutput.dailyTax = commandOutput.dailyTax != undefined ? commandOutput.dailyTax : 0.2;

    commandOutput.everyThirdDiscount = commandOutput.everyThirdDiscount != undefined ? commandOutput.everyThirdDiscount : 0;
    commandOutput.totalMaximum = commandOutput.totalMaximum != undefined ? commandOutput.totalMaximum : 500;
    commandOutput.maxIngredientType = commandOutput.maxIngredientType != undefined ? commandOutput.maxIngredientType : 10;
    commandOutput.maxDishType = commandOutput.maxDishType != undefined ? commandOutput.maxDishType : 3;

    commandOutput.dishWithAllergies = commandOutput.dishWithAllergies != undefined ? commandOutput.dishWithAllergies : 'waste';
    commandOutput.spoilRate = commandOutput.spoilRate != undefined ? parseFloat(`0${commandOutput.spoilRate}`) : 0.1;
    commandOutput.wasteLimit = commandOutput.wasteLimit != undefined ? commandOutput.wasteLimit : 50;
    commandOutput.maxTip = commandOutput.maxTip != undefined ? commandOutput.maxTip : 0.1;

    commandOutput.orderIngredientVolatility = commandOutput.orderIngredientVolatility != undefined ? commandOutput.orderIngredientVolatility : 10;
    commandOutput.orderDishVolatility = commandOutput.orderDishVolatility != undefined ? commandOutput.orderDishVolatility : 25;
    commandOutput.tipsTax = commandOutput.tipsTax != undefined ? commandOutput.tipsTax : 5;
}
