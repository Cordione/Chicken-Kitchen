import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { IRestaurant } from '../../Interface/IRestaurant';

export function buyOutput(alergies: string[], specificCustomer: ICustomerAlergies, orderedFood: IFood, orderCost: number, matching: string[], restaurant: IRestaurant) {
    const matchingAlergies = alergies.some(x => matching.includes(x));
    const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
    if (matchingAlergies && specificCustomer.budget < orderCost) {
        return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${
            orderedFood?.name
        } -> can't order, food cost ${orderCost}, alergic to: ${listOfMatchingAlergies.join(' ').toLowerCase()}`;
    } else if (matchingAlergies) {
        return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can't order, alergic to: ${listOfMatchingAlergies
            .join(' ')
            .toLowerCase()}`;
    } else if (specificCustomer.budget < orderCost) {
        return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can’t order, ${orderedFood?.name} costs ${orderCost}`;
    } else if (!matchingAlergies && specificCustomer.budget >= orderCost) {
        const output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name}, which cost: ${orderCost.toFixed(2)}: success`;
        specificCustomer.budget -= orderCost;
        restaurant.budget += orderCost;
        return output;
    }
}
