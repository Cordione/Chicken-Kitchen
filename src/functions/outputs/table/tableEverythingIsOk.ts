import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { IInformationsFromJsonFile } from '../../../Interface/IInformationsFromJsonFIle';
import { IMaterials } from '../../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../../Interface/IRestaurant';
import { ISpecificOrder } from '../../../Interface/ISpecificOrder';
import { randomGenerator } from '../../utils/randomGenerator';
import { removeElementsFromWarehouse } from '../../utils/removeElementsFromWarehouse';

export function tableEverythingIsOk(
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
    randomGenerator: (min: number, max: number) => number
) {
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
    const tips: number[] = [];
    const orderPrices: number[] = [];
    const orderTaxes: number[] = [];
    const pricesBeforeTaxes: number[] = [];

    for (let index = 0; index < customers.length; index++) {
        let discountToApply = 0;
        const isTipping = randomGenerator(0, 100);
        const maxTip = json.maxTip != undefined ? parseFloat(`0.${json.maxTip}`) : 0.1;
        const minTipRange = 0.01;
        let howBigWillBeTip = 0;
        let tip = 0;
        if (isTipping >= 50) {
            howBigWillBeTip = randomGenerator(minTipRange, maxTip);
            tip = Math.ceil(totalOrdersCost[index] * howBigWillBeTip);
            if (customers[index].budget < totalOrdersCost[index] + tip) {
                tip = Math.ceil(customers[index].budget - totalOrdersCost[index]);
            }
        }
        tips.push(tip);
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

    outputList.push(
        `${customersNames.join(', ')}, ordered ${foodList.join(', ')} -> success, total cost including tips: ${
            totalOrdersCost.reduce((a, b) => a + b, 0) + tips.reduce((a, b) => a + b, 0)
        }, total tax: ${totalTax}, total tips: ${tips.reduce((a, b) => a + b, 0)}.\n`
    );

    for (let index = 0; index < customers.length; index++) {
        const currentCustomer = customers[index].customerName;
        if (index == 0) {
            outputList.push(`{\n`);
        }
        let output = `${currentCustomer}, ordered ${foodList[index]}, cost: ${orderPrices[index] + tips[index]} -> success: `;
        if (tips[index] != 0) {
            output += `customer decided to tip: ${tips[index]}, Restaurant gets: ${pricesBeforeTaxes[index] + tips[index]}, transactionTax: ${orderTaxes[index]}.`;
        } 
        if (customers[index].sucessfulAppearances != 3) {
            output += `Restaurant gets: ${pricesBeforeTaxes[index] + tips[index]}, transactionTax: ${orderTaxes[index]}.\n`;
        } else {
            output += `Restaurant gets: ${pricesBeforeTaxes[index] + tips[index]}, transactionTax: ${orderTaxes[index]}.`;
        }
        if (customers[index].sucessfulAppearances == 3) {
            output += ` Because of your third appearance you recived discount worth: ${discounts[index]}\n`;
            customers[index].sucessfulAppearances = 0;
        }
        outputList.push(output);
        customers[index].budget -= orderPrices[index] - tips[index];
        restaurant.budget += orderPrices[index] - orderTaxes[index] + tips[index];
        if (index + 1 == customers.length) {
            outputList.push('}');
        }
    }
    return [outputList, totalTax, [], [], tips];
}
