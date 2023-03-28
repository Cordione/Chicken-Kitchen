import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { countTaxableProfit } from './countTaxableProfit';
import { taxesToPay } from './taxesToPay';

export function dailyTax(taxPaid: number[], tips: number[], budget: number[], json: IInformationsFromJsonFile): { dailyTaxAmount: number; tipsTaxToPay: number } {
    const tipsTaxFromJson = json.tipsTax != undefined ? json.tipsTax : 5;
    const tipsTaxesAsDecimal = tipsTaxFromJson / 100;
    const totalTaxPaid = taxPaid.reduce((a, b) => a + b, 0);
    const totalTips = tips.flat().reduce((a, b) => a + b, 0);
    const tipsTaxToPay = Math.ceil(totalTips * tipsTaxesAsDecimal);
    const taxableProfit = countTaxableProfit(totalTaxPaid, budget, totalTips);
    const dailyTaxAmount = taxesToPay(taxableProfit, json);
    return { dailyTaxAmount, tipsTaxToPay };
}
