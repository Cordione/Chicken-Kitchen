import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { ICustomerSpent } from '../../../Interface/ICustomerSpent';
import { IInformationsFromJsonFile } from '../../../Interface/IInformationsFromJsonFIle';
import { IMaterials } from '../../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../../Interface/IRestaurant';
import { ISpecificOrder } from '../../../Interface/ISpecificOrder';
import { randomGenerator } from '../../utils/randomGenerator';
import { removeElementsFromWarehouse } from '../../utils/removeElementsFromWarehouse';

export function tableEverythingIsOkPooled(
    customers: ICustomerAlergies[],
    informationAboutUsedMaterials: IMaterials[],
    warehouse: IObjectInWarehouse[],
    informationAboutOrdersAndItsPrice: ISpecificOrder[],
    restaurantMarkup: number,
    transactionTax: number,
    informationAboutMissingMaterials: IMaterials[],
    foodList: string[],
    json: IInformationsFromJsonFile,
    restaurant: IRestaurant,
    budgetsOfEachCustomers: number[],
    randomGenerator: (min: number, max: number) => number
) {
    const clonedCustomers: ICustomerAlergies[] = JSON.parse(JSON.stringify(customers));
    const customersNames = customers.map(x => x.customerName);
    customers.forEach(el => el.sucessfulAppearances++);
    const totalOrdersCost: number[] = [];
    const totalTaxOnOrders: number[] = [];
    const outputList: string[] = [];
    removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);

    for (let index = 0; index < customers.length; index++) {
        const orderCost = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
        const orderTax = Math.ceil(orderCost * transactionTax);
        totalOrdersCost.push(orderCost);
        totalTaxOnOrders.push(orderTax);
    }

    const totalTax = totalTaxOnOrders.reduce((a, b) => a + b, 0);
    const discounts: number[] = [];
    const orderPrices: number[] = [];
    const orderTaxes: number[] = [];
    const pricesBeforeTaxes: number[] = [];

    for (let index = 0; index < customers.length; index++) {
        let discountToApply = 0;

        if (customers[index].sucessfulAppearances == 3 && informationAboutMissingMaterials.length == 0) {
            discountToApply = json.everyThirdDiscount != undefined ? parseFloat(`0.${json.everyThirdDiscount}`) : 0;
        }
        const discountInMoney = Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup * discountToApply);
        const orderPrice =
            Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney) <= customers[index].budget
                ? Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup - discountInMoney)
                : Math.ceil(informationAboutOrdersAndItsPrice[index].price * restaurantMarkup);
        orderPrices.push(orderPrice);
        const orderTax = Math.ceil(orderPrice * transactionTax);
        orderTaxes.push(orderTax);
        const priceBeforeTaxes = orderPrice - orderTax;
        pricesBeforeTaxes.push(priceBeforeTaxes);
        discounts.push(discountInMoney);
    }
    // console.log(`total tax: ${totalTax}, discounts: ${discounts},tips: ${tips},op: ${orderPrices},ot: ${orderTaxes}, pricesb4tax: ${pricesBeforeTaxes}`);
    const sumOfCustomerBudget = budgetsOfEachCustomers.reduce((a, b) => a + b, 0);
    const allOrdersCost = totalOrdersCost.reduce((a, b) => a + b, 0);
    const isTipping = randomGenerator(0, 100);
    const maxTip = json.maxTip;
    const minTipRange = 0.01;
    let howBigWillBeTip = 0;
    let tip = 0;
    if (isTipping >= 50) {
        howBigWillBeTip = randomGenerator(minTipRange, maxTip);
        tip = Math.ceil(totalOrdersCost.reduce((a, b) => a + b, 0) * howBigWillBeTip);
        if (sumOfCustomerBudget < allOrdersCost + tip) {
            tip = Math.ceil(allOrdersCost + tip - sumOfCustomerBudget);
        }
    }
    let sumOfTotalOrdersCost = totalOrdersCost.reduce((a, b) => a + b, 0);
    let tipToBePaid = tip;
    const customerSpentOnOrders: ICustomerSpent[] = [];
    const customerSpentOnTips: ICustomerSpent[] = [];

    while (sumOfTotalOrdersCost > 0) {
        let smallestBuget = 0;
        for (let i = 0; i < customers.length; i++) {
            //find Math min different than 0
            if (smallestBuget == 0 && customers[i].budget > 0) {
                smallestBuget = customers[i].budget;
            } else if (customers[i].budget < smallestBuget && customers[i].budget > 0) {
                smallestBuget = customers[i].budget;
            }
        }
        const customersWithCash = customers.filter(x => x.budget >= smallestBuget);
        const moneyToPayPerCustomerWithRemainingBudget = sumOfTotalOrdersCost / customersWithCash.length;
        //Remove money from customer budgets to pay for orders
        for (let i = 0; i < customersWithCash.length; i++) {
            const alreadyOnList = customerSpentOnOrders.find(x => x.name.toLowerCase() === customersWithCash[i].customerName.toLowerCase());
            if (smallestBuget > moneyToPayPerCustomerWithRemainingBudget) {
                if (alreadyOnList) {
                    alreadyOnList.spent += moneyToPayPerCustomerWithRemainingBudget;
                } else {
                    customerSpentOnOrders.push({ name: customersWithCash[i].customerName, spent: moneyToPayPerCustomerWithRemainingBudget });
                }
                customersWithCash[i].budget -= moneyToPayPerCustomerWithRemainingBudget;
                sumOfTotalOrdersCost -= moneyToPayPerCustomerWithRemainingBudget;
            } else if (smallestBuget < moneyToPayPerCustomerWithRemainingBudget) {
                if (alreadyOnList) {
                    alreadyOnList.spent += smallestBuget;
                } else {
                    customerSpentOnOrders.push({ name: customersWithCash[i].customerName, spent: smallestBuget });
                }
                customersWithCash[i].budget -= smallestBuget;
                sumOfTotalOrdersCost -= smallestBuget;
            }
        }
    }
    while (tipToBePaid > 0) {
        let smallestBuget = 0;
        for (let i = 0; i < customers.length; i++) {
            //find Math min different than 0
            if (smallestBuget == 0 && customers[i].budget > 0) {
                smallestBuget = customers[i].budget;
            } else if (customers[i].budget < smallestBuget && customers[i].budget > 0) {
                smallestBuget = customers[i].budget;
            }
        }
        const customersWithCash = customers.filter(x => x.budget >= smallestBuget);
        const moneyToPayPerCustomerWithRemainingBudget = tipToBePaid / customersWithCash.length;
        //Remove money from customer budgets to pay tip
        for (let i = 0; i < customersWithCash.length; i++) {
            const alreadyOnList = customerSpentOnTips.find(x => x.name.toLowerCase() === customersWithCash[i].customerName.toLowerCase());
            if (smallestBuget > moneyToPayPerCustomerWithRemainingBudget) {
                if (alreadyOnList) {
                    alreadyOnList.spent += moneyToPayPerCustomerWithRemainingBudget;
                } else {
                    customerSpentOnTips.push({ name: customersWithCash[i].customerName, spent: moneyToPayPerCustomerWithRemainingBudget });
                }
                customersWithCash[i].budget -= moneyToPayPerCustomerWithRemainingBudget;
                tipToBePaid -= moneyToPayPerCustomerWithRemainingBudget;
            } else if (smallestBuget < moneyToPayPerCustomerWithRemainingBudget) {
                if (alreadyOnList) {
                    alreadyOnList.spent += smallestBuget;
                } else {
                    customerSpentOnTips.push({ name: customersWithCash[i].customerName, spent: smallestBuget });
                }
                customersWithCash[i].budget -= smallestBuget;
                tipToBePaid -= smallestBuget;
            }
        }
    }

    outputList.push(
        `${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> success, total cost including tips: ${
            totalOrdersCost.reduce((a, b) => a + b, 0) + tip
        }, total tax: ${totalTax}, total tips: ${tip}.\n`
    );

    for (let index = 0; index < customers.length; index++) {
        const currentCustomer = customers[index].customerName;
        if (index == 0) {
            outputList.push(`{\n`);
        }
        //Find if current customer exists in whoWasPayingTip
        const spentOnTip = customerSpentOnTips.find(x => x.name.toLowerCase() === currentCustomer.toLowerCase());
        const paidForDish = customerSpentOnOrders.find(x => x.name.toLowerCase() === currentCustomer.toLowerCase());
        let output = '';
        let dishCost = paidForDish == undefined ? 0 : paidForDish.spent;
        let tipCost = spentOnTip == undefined ? 0 : spentOnTip.spent;
        output = `${currentCustomer}, ordered ${foodList[index]}, spent: ${dishCost + tipCost}, table was pooled -> success: `;
        if (tipCost != 0) {
            output += `customer decided to tip: ${tipCost} `;
        }
        if (customers[index].sucessfulAppearances != 3) {
            output += `Restaurant gets: ${dishCost + tipCost}.\n`;
        } else {
            output += `Restaurant gets: ${dishCost + tipCost}.`;
        }
        if (customers[index].sucessfulAppearances == 3) {
            output += ` Because of your third appearance you recived discount worth: ${discounts[index]}\n`;
            customers[index].sucessfulAppearances = 0;
        }
        outputList.push(output);
        if (index + 1 == customers.length) {
            outputList.push('}');
        }
        customers[index].budget -= orderPrices[index] - tipCost;
        restaurant.budget += orderPrices[index] - orderTaxes[index] + tipCost;
    }
    return [outputList, totalTax, [], [], [tip]];
}
