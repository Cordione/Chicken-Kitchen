import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';

export function taxesToPay(profit: number, informationsFromJsonFile: IInformationsFromJsonFile) {
    const dailyTax = informationsFromJsonFile.dailyTax != undefined ? parseFloat(`0.${informationsFromJsonFile.dailyTax}`) : 0.2;
    const dailyTaxAmount = Math.ceil(profit * dailyTax) > 0 ? Math.ceil(profit * dailyTax) : 0
    return dailyTaxAmount;
}
