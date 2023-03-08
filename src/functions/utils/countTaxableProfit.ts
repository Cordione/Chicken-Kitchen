import { IRestaurant } from "../../Interface/IRestaurant";

export function countTaxableProfit(totalTaxPaid: number, budget: number[]){
    return budget[budget.length -1] - budget[0] - totalTaxPaid
}