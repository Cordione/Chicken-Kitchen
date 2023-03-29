import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { IFood } from '../../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../../Interface/IInformationsFromJsonFIle';
import { IMaterials } from '../../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../../Interface/IRestaurant';
import { removeElementsFromWarehouse } from '../../utils/removeElementsFromWarehouse';

export function buyEverythingIsOk(
    specificCustomer: ICustomerAlergies,
    specificDish: IFood,
    orderCost: number,
    orderTax: number,
    discountInMoney: number,
    restaurant: IRestaurant,
    informationAboutUsedMaterials: IMaterials[],
    warehouse: IObjectInWarehouse[],
    json: IInformationsFromJsonFile,
    randomGenerator: (min: number, max: number) => number
) {
    specificCustomer.sucessfulAppearances++;
    const isTipping = randomGenerator(0, 100);
    const maxTip = json.maxTip;
    const minTipRange = 0.01;
    let howBigWillBeTip = 0;
    let tip = 0;
    if (isTipping >= 50) {
        howBigWillBeTip = randomGenerator(minTipRange, maxTip);
        tip = Math.ceil(orderCost * howBigWillBeTip);
        if (specificCustomer.budget < orderCost + tip) {
            tip = Math.ceil(specificCustomer.budget - orderCost);
        }
    }
    const orderCostWithoutTax = orderCost - orderTax;
    let output = `${specificCustomer.customerName} has budget: ${specificCustomer.budget} -> wants to order ${specificDish?.name}, which cost: ${orderCost}: success -> `;
    if (tip != 0) {
        output += `customer decided to tip: ${tip}, Restaurant gets: ${orderCostWithoutTax + tip}, transactionTax: ${orderTax}.`;
    } else {
        output += `Restaurant gets: ${orderCostWithoutTax + tip}, transactionTax: ${orderTax}.`;
    }
    if (specificCustomer.sucessfulAppearances == 3) {
        output += ` Because of your third appearance you recived discount worth: ${discountInMoney}.`;
        specificCustomer.sucessfulAppearances = 0;
    }

    specificCustomer.budget -= orderCost + tip;
    restaurant.budget += orderCostWithoutTax;
    removeElementsFromWarehouse(informationAboutUsedMaterials, warehouse);
    return [output, orderTax, [], [], tip];
}
