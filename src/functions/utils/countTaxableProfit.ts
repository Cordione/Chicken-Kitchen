export function countTaxableProfit(totalTaxPaid: number, budget: number[], tips: number) {
    return budget[budget.length - 1] - budget[0] - totalTaxPaid - tips;
}
