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
import { filterOrders } from '../utils/filterOrders';
import { informationsAboutOrders } from '../utils/informationsAboutOrders';
import { listOfCustomers } from '../utils/listOfCustomers';
import { removeElementsFromWarehouse } from '../utils/removeElementsFromWarehouse';

export function tableOutput(
    commandAndParameters: ICommandAndParameters,
    customerList: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurantMarkup: number,
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJsonFile: IInformationsFromJsonFile
) {
    //Should work properly for multiple customers
    //which guests want to take table:
    const customers: ICustomerAlergies[] = listOfCustomers(commandAndParameters, customerList);
    const unqiueCustomers = [...new Set(customers)];
    const foodList: string[] = filterOrders(commandAndParameters, food);
    const foodListToLowerCase = foodList.map(x => x.toLowerCase());
    const informations = informationsAboutOrders(commandAndParameters, customers, food, baseIngredients, warehouse);
    const informationAboutOrdersAndItsPrice: ISpecificOrder[] = informations[0] as ISpecificOrder[];
    const informationAboutAlergies: string[][] = informations[1] as string[][];
    const informationAboutUnavailableFood: string[] = informations[2] as string[];
    const informationAboutMissingMaterials: IMaterials[] = informations[3] as IMaterials[];
    const informationAboutUsedMaterials: IMaterials[] = informations[4] as IMaterials[];

    const customerNames = customers.map(x => x.customerName.toLowerCase());
    const unknownParameters = commandAndParameters.parameters?.filter(x => !customerNames.includes(x.toLowerCase()) && !foodListToLowerCase.includes(x.toLowerCase()));
    const transactionTax: number = informationsFromJsonFile.transactionTax != undefined ? parseFloat(`0.${informationsFromJsonFile.transactionTax}`) : 0.2;

    let totalTax;
    let anyoneIsAlergic: boolean = false;
    informationAboutAlergies.map(el => {
        if (el.length > 0) {
            anyoneIsAlergic = true;
        }
    });
    let anyoneOrderedUnavailableFood: boolean = false;
    informationAboutUnavailableFood.map(el => {
        if (el.length > 0) {
            anyoneOrderedUnavailableFood = true;
        }
    });

    const outputList: string[] = [];
    if (unknownParameters != undefined && unknownParameters?.length > 0) {
        //We recived unkown parameter!
        return `Error no idea what is ${unknownParameters.join(', ')}`;
    } else if (customers.length == unqiueCustomers.length && customers.length == foodList.length) {
        if (anyoneIsAlergic) {
            // one of customers is allergic to ordered food
            const customersNames = customers.map(x => x.customerName);
            outputList.push(`${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> FAILURE\n`);
            removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
            for (let index = 0; index < customers.length; index++) {
                if (index == 0) {
                    outputList.push(`{\n`);
                }
                if (informationAboutAlergies[index].length > 0) {
                    outputList.push(
                        `We're sorry: ${customers[index].customerName}, we cannot provide you with table, becouse you're alergic to: ${informationAboutAlergies[index].join(' ').toLowerCase()}\n`
                    );
                }
                if (informationAboutAlergies[index].length == 0) {
                    outputList.push(`We're sorry ${customers[index].customerName}, we cannot provide you with table, becouse other guest is alergic to his order\n`);
                }
                if (index + 1 == customers.length) {
                    outputList.push('}');
                }
            }
        } else if (informationAboutMissingMaterials.length > 0) {
            const missingIngredientsNames = informationAboutMissingMaterials.map(x => x.name);
            return `Sorry we're out of supplies. Missing: ${missingIngredientsNames.join(', ')}`;
        } else if (!anyoneIsAlergic && anyoneOrderedUnavailableFood) {
            return informationAboutUnavailableFood.find(x => x.length > 0);
        } else if (!anyoneIsAlergic && !anyoneOrderedUnavailableFood) {
            const whoCouldntPay: ICustomerAlergies[] = [];
            let everyoneCanPayForTheirOrder: boolean = true;

            for (let index = 0; index < customers.length; index++) {
                let discountToApply = 0;

                if (customers[index].sucessfulAppearances == 2 && informationAboutMissingMaterials.length == 0) {
                    discountToApply = informationsFromJsonFile.everyThirdDiscount != undefined ? parseFloat(`0.${informationsFromJsonFile.everyThirdDiscount}`) : 0;
                }
                const discountInMoney = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup * discountToApply);
                const orderPrice =
                    Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney) <= customers[index].budget
                        ? Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney)
                        : Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
                // const orderPrice = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
                if (customers[index].budget < orderPrice) {
                    everyoneCanPayForTheirOrder = false;
                    whoCouldntPay.push(customers[index]);
                }
            }

            if (!everyoneCanPayForTheirOrder) {
                const customersNames = customers.map(x => x.customerName);
                const whoCouldntPayNames = whoCouldntPay.map(x => x.customerName);
                outputList.push(`${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> FAILURE\n`);
                for (let index = 0; index < customers.length; index++) {
                    const orderPrice = informationAboutOrdersAndItsPrice[index].price * restaurantMarkup;
                    const currentCustomer = customers[index].customerName;
                    if (index == 0) {
                        outputList.push(`{\n`);
                    }
                    if (whoCouldntPayNames.includes(currentCustomer)) {
                        outputList.push(
                            `We're sorry: ${customers[index].customerName}, we cannot provide you with table, becouse you cannot afford your order, yours budget: ${
                                customers[index].budget
                            }, order cost: ${orderPrice.toFixed(2)}\n`
                        );
                    } else {
                        outputList.push(`We're sorry: ${customers[index].customerName}, we cannot provide you with table, becouse other guest cannot afford his order\n`);
                    }

                    if (index + 1 == customers.length) {
                        outputList.push('}');
                    }
                }
            } else if (everyoneCanPayForTheirOrder) {
                const customersNames = customers.map(x => x.customerName);
                customers.forEach(el => el.sucessfulAppearances++);
                const totalOrdersCost: number[] = [];
                const totalTaxOnOrders: number[] = [];
                removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
                for (let index = 0; index < customers.length; index++) {
                    const orderCost = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
                    const orderTax = Math.ceil(orderCost * transactionTax);
                    totalOrdersCost.push(orderCost);
                    totalTaxOnOrders.push(orderTax);
                }
                totalTax = totalTaxOnOrders.reduce((a, b) => a + b, 0);
                outputList.push(`${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> success, total cost: ${totalOrdersCost.reduce((a, b) => a + b, 0)}, total tax: ${totalTax}\n`);

                for (let index = 0; index < customers.length; index++) {
                    let discountToApply = 0;

                    if (customers[index].sucessfulAppearances == 3 && informationAboutMissingMaterials.length == 0) {
                        discountToApply = informationsFromJsonFile.everyThirdDiscount != undefined ? parseFloat(`0.${informationsFromJsonFile.everyThirdDiscount}`) : 0;
                    }
                    const discountInMoney = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup * discountToApply);
                    const orderPrice =
                        Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney) <= customers[index].budget
                            ? Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney)
                            : Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);

                    // const orderPrice = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
                    const orderTax = Math.ceil(orderPrice * transactionTax);
                    const priceBeforeTaxes = orderPrice - orderTax;

                    const currentCustomer = customers[index].customerName;
                    if (index == 0) {
                        outputList.push(`{\n`);
                    }
                    if (customers[index].sucessfulAppearances == 3) {
                        outputList.push(
                            `${currentCustomer}, ordered ${foodList[index]}, cost: ${orderPrice} -> success: Restaurant gets: ${priceBeforeTaxes}, tax: ${orderTax}. Becouse of your third appearance you recived discount worth: ${discountInMoney}\n`
                        );
                        customers[index].sucessfulAppearances = 0;
                    } else {
                        outputList.push(`${currentCustomer}, ordered ${foodList[index]}, cost: ${orderPrice} -> success: Restaurant gets: ${priceBeforeTaxes}, tax: ${orderTax}\n`);
                    }

                    customers[index].budget -= orderPrice;
                    restaurant.budget += orderPrice - orderTax;
                    if (index + 1 == customers.length) {
                        outputList.push('}');
                    }
                }
            }
        }
        return [outputList.join(''), totalTax];
    } else if (unqiueCustomers.length != customers.length) {
        //each customer can appear only once @ table
        return `ERROR. One person can appear only once at the table.`;
    } else if (unqiueCustomers.length - foodList.length != 0) {
        //More ppl than food
        if (unqiueCustomers.length - foodList.length > 0) {
            return `ERROR. Every person needs something to eat.`;
        }
        //More food than ppl
        if (unqiueCustomers.length - foodList.length < 0) {
            return `ERROR. One person can have one type of food only.`;
        }
    }
}
