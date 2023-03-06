import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { IMaterials } from '../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { customersParser } from '../parsers/customersParser';
import { foodParser } from '../parsers/foodParser';
import { warehouseParser } from '../parsers/warehouseParser';
import { filterOrders } from '../utils/filterOrders';
import { informationsAboutOrders } from '../utils/informationsAboutOrders';
import { listOfCustomers } from '../utils/listOfCustomers';
import { removeElementsFromWarehouse } from '../utils/removeElementsFromWarehouse';

export function buyOutput(
    commandAndParameters: ICommandAndParameters,
    customerList: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurantMarkup: number,
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[]
) {
    const customers: ICustomerAlergies[] = listOfCustomers(commandAndParameters, customerList);
    const informations = informationsAboutOrders(commandAndParameters, customers, food, baseIngredients, warehouse);
    const informationAboutAlergies: string[][] = informations[1] as string[][];
    const isAlergic = informationAboutAlergies[0].length > 0;
    const informationAboutMissingMaterials: IMaterials[] = informations[3] as IMaterials[];
    const informationAboutUsedMaterials: IMaterials[] = informations[4] as IMaterials[];
    const specificCustomer = customers[0];
    const customerNames = customers.map(x => x.customerName.toLowerCase());
    const unknownParameters = commandAndParameters.parameters?.filter(x => !customerNames.includes(x.toLowerCase()));
    if (specificCustomer == undefined && unknownParameters != undefined) {
        return `Sorry we don't have information about your alergies ${unknownParameters[0]},so we cannot fulfil your order`;
    } else if (commandAndParameters.parameters != undefined) {
        const dish = commandAndParameters.parameters[1];
        const specificDish = food.find(x => x.name.toLowerCase() === dish.toLowerCase());
        if (specificDish != undefined) {
            const orderCost = specificDish.price * restaurantMarkup;
            if (isAlergic) {
                removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
                return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${
                    specificDish?.name
                } -> can't order, food cost ${orderCost}, alergic to: ${informationAboutAlergies[0].join(' ').toLowerCase()}`;
            } else if (specificCustomer.budget < specificDish?.price * restaurantMarkup) {
                return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${specificDish?.name} -> can’t order, ${specificDish?.name} costs ${orderCost}`;
            } else if (!isAlergic && specificCustomer.budget >= specificDish?.price * restaurantMarkup && informationAboutMissingMaterials.length == 0) {
                const output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${specificDish?.name}, which cost: ${orderCost.toFixed(2)}: success`;
                removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
                specificCustomer.budget -= orderCost;
                restaurant.budget += orderCost;
                return output;
            } else if (informationAboutMissingMaterials.length > 0) {
                const missingIngredientsNames = informationAboutMissingMaterials.map(x => x.name)
                return `Sorry we're out of supplies. Missing: ${missingIngredientsNames.join(', ')}`;
            }
        }
    }
}
// console.log(
//     buyOutput(
//         { command: 'buy', parameters: ['Alexandra SMith', 'princess chicken'] },
//         customersParser('./src/csv_files/customersAlergies.csv'),
//         foodParser('./src/csv_files/food.csv'),
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
//         1.3,
//         { budget: 500 },
//         warehouseParser('', baseIngredientsParser('./src/csv_files/baseIngredients.csv'))
//     )
// );

// export function buyOutput(alergies: string[], specificCustomer: ICustomerAlergies, orderedFood: IFood, orderCost: number, matching: string[], restaurant: IRestaurant, warehouse: IObjectInWarehouse[]) {
//     const matchingAlergies = alergies.some(x => matching.includes(x));
//     const listOfMatchingAlergies = alergies.filter(x => matching.includes(x));
// if (matchingAlergies && specificCustomer.budget < orderCost) {
//     return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can't order, food cost ${orderCost}, alergic to: ${listOfMatchingAlergies
//         .join(' ')
//         .toLowerCase()}`;
// } else if (matchingAlergies) {
//     return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can't order, alergic to: ${listOfMatchingAlergies
//         .join(' ')
//         .toLowerCase()}`;
// }
// else if (specificCustomer.budget < orderCost) {
//         return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name} -> can’t order, ${orderedFood?.name} costs ${orderCost}`;
//     }
// else if (!matchingAlergies && specificCustomer.budget >= orderCost) {
//         const output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${orderedFood?.name}, which cost: ${orderCost.toFixed(2)}: success`;
//         specificCustomer.budget -= orderCost;
//         restaurant.budget += orderCost;
//         return output;
//     }
// }
