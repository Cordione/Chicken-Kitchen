
export function taxesToPay(profit: number, dailyTaxes: number) {
    const dailyTax = dailyTaxes != undefined ? parseFloat(`0.${dailyTaxes}`) : 0.2;
    const dailyTaxAmount = Math.ceil(profit * dailyTax) > 0 ? Math.ceil(profit * dailyTax) : 0;
    return dailyTaxAmount;
}
