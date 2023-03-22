import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
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
import { keepDishes } from '../utils/keepDishes';
import { updatedInfromationsAboutMaterials } from '../utils/updatedInformationsAboutMaterials';

export function buyOutput(
    commandAndParameters: ICommandAndParameters,
    customerList: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurantMarkup: number,
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJsonFile: IInformationsFromJsonFile
) {
    const customers: ICustomerAlergies[] = listOfCustomers(commandAndParameters, customerList);
    const informations = informationsAboutOrders(commandAndParameters, customers, food, baseIngredients, warehouse, informationsFromJsonFile);
    const foodList: string[] = filterOrders(commandAndParameters, food);
    const foodListToLowerCase = foodList.map(x => x.toLowerCase());
    const informationAboutAlergies: string[][] = informations[1] as string[][];
    const informationAboutMissingMaterials: IMaterials[] = informations[3] as IMaterials[];
    const informationAboutUsedMaterials: IMaterials[] = informations[4] as IMaterials[];
    const specificCustomer = customers[0];
    const customerNames = customers.map(x => x.customerName.toLowerCase());
    const unknownCustomer = commandAndParameters.parameters?.filter(x => !customerNames.includes(x.toLowerCase()));
    const transactionTax: number = informationsFromJsonFile.transactionTax != undefined ? parseFloat(`0.${informationsFromJsonFile.transactionTax}`) : 0.2;
    let spoiledMaterials: IObjectInWarehouse[] = [];
    let output = '';
    if (commandAndParameters.parameters != undefined) {
        const unknownFood = !foodListToLowerCase.includes(commandAndParameters.parameters[1]?.toLowerCase());
        if (unknownFood) {
            return `Sorry we don't serve: ${commandAndParameters.parameters[1]}`;
        }
    }
    if (informationAboutAlergies[0] != undefined) {
        const isAlergic = informationAboutAlergies[0].length > 0;
        if (specificCustomer == undefined && unknownCustomer != undefined) {
            return `Sorry we don't have information about your alergies ${unknownCustomer[0]},so we cannot fulfil your order`;
        } else if (commandAndParameters.parameters != undefined) {
            const dish = commandAndParameters.parameters[1];
            const specificDish = food.find(x => x.name.toLowerCase() === dish.toLowerCase());
            if (specificDish != undefined) {
                let discountToApply = 0;

                if (specificCustomer.sucessfulAppearances == 2 && !isAlergic && informationAboutMissingMaterials.length == 0) {
                    discountToApply = informationsFromJsonFile.everyThirdDiscount != undefined ? parseFloat(`0.${informationsFromJsonFile.everyThirdDiscount}`) : 0;
                }
                const discountInMoney = Math.ceil(specificDish.price * restaurantMarkup * discountToApply);

                const orderCost =
                    Math.ceil(specificDish.price * restaurantMarkup - discountInMoney) <= specificCustomer.budget
                        ? Math.ceil(specificDish.price * restaurantMarkup - discountInMoney)
                        : Math.ceil(specificDish.price * restaurantMarkup);
                const orderTax = Math.ceil(orderCost * transactionTax);
                if (isAlergic) {
                    const whatDoWeDoWithDishesFromAlergics = informationsFromJsonFile.dishWithAllergies != undefined ? informationsFromJsonFile.dishWithAllergies : 'waste';
                    let updatedInformationsAboutUsedMaterials: IMaterials[] = informationAboutUsedMaterials;
                    removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
                    if (whatDoWeDoWithDishesFromAlergics === 'waste') {
                    }
                    if (whatDoWeDoWithDishesFromAlergics === 'keep') {
                        keepDishes([specificDish], restaurant, warehouse, informationsFromJsonFile);
                        updatedInformationsAboutUsedMaterials = [];
                        //Prepared to expand output with details about stored dishes
                        // storedDishes = keepDishes(informationAboutOrdersAndItsPrice, restaurant, warehouse, informationsFromJsonFile);
                    }
                    if (typeof whatDoWeDoWithDishesFromAlergics === 'number') {
                        const dish = keepDishes([specificDish], restaurant, warehouse, informationsFromJsonFile);
                        updatedInformationsAboutUsedMaterials = updatedInfromationsAboutMaterials(informationAboutUsedMaterials, dish, food);
                        //Prepared to expand output with details about stored dishes
                        // storedDishes = keepDishes(informationAboutOrdersAndItsPrice, restaurant, warehouse, informationsFromJsonFile);
                    }
                    let output = '';
                    spoiledMaterials = informations[6] as IObjectInWarehouse[];
                    output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${
                        specificDish?.name
                    } -> can't order, food cost ${orderCost}, alergic to: ${informationAboutAlergies[0].join(' ').toLowerCase()}`;
                    return [output, undefined, spoiledMaterials, updatedInformationsAboutUsedMaterials];
                } else if (specificCustomer.budget < orderCost) {
                    return `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${specificDish?.name} -> can’t order, ${specificDish?.name} costs ${orderCost}`;
                } else if (!isAlergic && specificCustomer.budget >= orderCost && informationAboutMissingMaterials.length == 0) {
                    specificCustomer.sucessfulAppearances++;
                    let output = ``;
                    if (specificCustomer.sucessfulAppearances == 3) {
                        output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${
                            specificDish?.name
                        }, which cost: ${orderCost}: success -> Restaurant gets: ${
                            orderCost - orderTax
                        }, transactionTax: ${orderTax}. Becouse of your third appearance you recived discount worth: ${discountInMoney}`;
                        specificCustomer.sucessfulAppearances = 0;
                    } else {
                        output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${
                            specificDish?.name
                        }, which cost: ${orderCost}: success -> Restaurant gets: ${orderCost - orderTax}, transactionTax: ${orderTax}`;
                    }

                    specificCustomer.budget -= orderCost;
                    restaurant.budget += orderCost - orderTax;
                    removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
                    spoiledMaterials = informations[6] as IObjectInWarehouse[];
                    return [output, orderTax];
                } else if (informationAboutMissingMaterials.length > 0) {
                    const missingIngredientsNames = informationAboutMissingMaterials.map(x => x.name);
                    return `Sorry we're out of supplies. Missing: ${missingIngredientsNames.join(', ')}`;
                }
            }
        }
    }
}
// console.log(
//     buyOutput(
//         { command: 'buy', parameters: ['bernard unfortunate', 'pretzels'] },
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
