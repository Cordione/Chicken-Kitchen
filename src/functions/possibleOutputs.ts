import { ICustomerAlergies } from '../Interface/ICustomerAlergies';
import { IFood } from '../Interface/IFood';

export function possibleOutputs(command: string, alergies: string[], specificCustomer: ICustomerAlergies, orderedFood: IFood, orderCost: number, matching: string[]) {
    const matchingAlergies = alergies.some(x => matching.includes(x));
    const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
    if (command.toLowerCase() == 'Buy'.toLowerCase()) {
        if (matchingAlergies && specificCustomer.budget < orderCost) {
            return `${specificCustomer.customerName} have budget: ${specificCustomer.budget} -> wants to order ${
                orderedFood?.name
            } -> can't order, food cost ${orderCost}, alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}`;
        } else if (matchingAlergies) {
            return `${specificCustomer.customerName} have budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can't order, alergic to: ${listOfMatchingAlergies
                .join(' ')
                .toLowerCase()}`;
        } else if (specificCustomer.budget < orderCost) {
            return `${specificCustomer.customerName} have budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can’t order, ${orderedFood?.name} costs ${orderCost}`;
        } else if (!matchingAlergies && specificCustomer.budget >= orderCost) {
            const output = `${specificCustomer.customerName} have budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name}, which cost: ${orderCost}: success`;
            specificCustomer.budget -= orderCost;
            return output;
        }
    }
}
