import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';

export function possibleOutputs(alergies: string[], specificCustomer: ICustomerAlergies, orderedFood: IFood, orderCost: number, matching: string[]) {
    const matchingAlergies = alergies.some(x => matching.includes(x));
    const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
    if (matchingAlergies) {
        return `${specificCustomer.customerName} - ${orderedFood?.name}: can't order, alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}`;
    } else if (specificCustomer.budget < orderCost) {
        return `${specificCustomer.customerName} – can’t order, budget ${specificCustomer.budget} and ${orderedFood?.name} costs ${orderCost}`;
    } else if (!matchingAlergies && specificCustomer.budget >= orderCost) {
        specificCustomer.budget -= orderCost;
        return `${specificCustomer.customerName} - ${orderedFood?.name}: success`;
    }
}
