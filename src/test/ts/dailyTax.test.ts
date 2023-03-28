import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { dailyTax } from '../../functions/utils/dailyTax';

describe('Daily tax tests', () => {
    test('Should properly count daily taxes', () => {
        //given
        const taxPaid: number[] = [50, 50];
        const tips: number[] = [25, 25, 25, 25];
        const budget: number[] = [500, 600, 700, 800, 800];
        const jsonSource = '../../json/all.json';
        const json = commandJSONFileOutput(jsonSource);
        //when
        const { dailyTaxAmount, tipsTaxToPay } = dailyTax(taxPaid, tips, budget, json.tipsTax, json.dailyTax);
        //then
        // Paid already 100 tax, Recived 100 in tips which should be excluded
        // So we have 800 - 100 = 700, 700-100 = 600, 600-500 = 100, 100*0.2 = 20
        //It's daily tax without Taxes
        expect(dailyTaxAmount).toEqual(20);
        //Recived 100 in tips, 0.05 tax rate = 5
        expect(tipsTaxToPay).toEqual(5);
    });
});
