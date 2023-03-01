import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { IRestaurant } from '../../Interface/IRestaurant';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { customersParser } from '../parsers/customersParser';
import { foodParser } from '../parsers/foodParser';
import { filterOrders } from '../utils/filterOrders';
import { informationsAboutOrders } from '../utils/informationsAboutOrders';
import { listOfCustomers } from '../utils/listOfCustomers';

export function tableOutput(
    commandAndParameters: ICommandAndParameters,
    customerList: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    restaurantMarkup: number,
    restaurant: IRestaurant
) {
    //Should work properly for multiple customers
    //which guests want to take table:
    const customers: ICustomerAlergies[] = listOfCustomers(commandAndParameters, customerList);
    const unqiueCustomers = [...new Set(customers)];
    const foodList: string[] = filterOrders(commandAndParameters, food);
    const foodListToLowerCase = foodList.map(x => x.toLowerCase());
    const informations = informationsAboutOrders(commandAndParameters, customers, food, baseIngredients);
    const informationAboutOrdersAndItsPrice: ISpecificOrder[] = informations[0] as ISpecificOrder[];
    const informationAboutAlergies: string[][] = informations[1] as string[][];
    const informationAboutUnavailableFood: string[] = informations[2] as string[];
    const customerNames = customers.map(x => x.customerName.toLowerCase());
    const unknownParameters = commandAndParameters.parameters?.filter(x => !customerNames.includes(x.toLowerCase()) && !foodListToLowerCase.includes(x.toLowerCase()));

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
        } else if (!anyoneIsAlergic && anyoneOrderedUnavailableFood) {
            return informationAboutUnavailableFood.find(x => x.length > 0);
        } else if (!anyoneIsAlergic && !anyoneOrderedUnavailableFood) {
            const whoCouldntPay: ICustomerAlergies[] = [];
            let everyoneCanPayForTheirOrder: boolean = true;
            for (let index = 0; index < customers.length; index++) {
                if (customers[index].budget < informationAboutOrdersAndItsPrice[index].price * restaurantMarkup) {
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
                const totalOrdersCost: number[] = [];
                for (let index = 0; index < customers.length; index++) {
                    totalOrdersCost.push(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
                }
                outputList.push(`${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> success, total cost: ${totalOrdersCost.reduce((a, b) => a + b, 0).toFixed(2)}\n`);

                for (let index = 0; index < customers.length; index++) {
                    const orderPrice = informationAboutOrdersAndItsPrice[index].price * restaurantMarkup;
                    const currentCustomer = customers[index].customerName;
                    if (index == 0) {
                        outputList.push(`{\n`);
                    }
                    outputList.push(`${currentCustomer}, ordered ${foodList[index]}, -> success: ${orderPrice.toFixed(2)}\n`);
                    customers[index].budget -= orderPrice;
                    restaurant.budget += orderPrice;
                    if (index + 1 == customers.length) {
                        outputList.push('}');
                    }
                }
            }
        }
        return outputList.join('');
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
