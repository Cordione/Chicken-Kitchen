import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';

export function handleOrder(
    specificItem: string,
    amount: string,
    baseIngredients: IBaseIngredients[],
    food: IFood[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    let totalCostBeforeTaxes = 0;
    const singleIngredient = baseIngredients.find(ingredient => ingredient.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const singleDish = food.find(dish => dish.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const taxes: number = informationsFromJSONFile.transactionTax != undefined ? parseFloat(`0.${informationsFromJSONFile.transactionTax}`) : 0.1;
    if (singleIngredient == undefined && singleDish == undefined) {
        return `We recived malformed input, there's no such ingredient/dish as: ${specificItem}`;
    } else if (singleIngredient != undefined) {
        if (informationsFromJSONFile.order === 'ingredients' || informationsFromJSONFile.order === 'all') {
            totalCostBeforeTaxes = Math.ceil(singleIngredient.cost * parseInt(amount));
        }
    } else if (singleDish != undefined) {
        if (informationsFromJSONFile.order === 'dishes' || informationsFromJSONFile.order === 'all') {
            totalCostBeforeTaxes = Math.ceil(singleDish?.price * parseInt(amount));
        }
    }
    if (singleIngredient == undefined && informationsFromJSONFile.order ==="ingredients") {
        return `We recived malformed input, there's no such ingredient as: ${specificItem}`;
    }
    if (singleDish == undefined && informationsFromJSONFile.order === 'dishes') {
        return `We recived malformed input, there's no such dish as: ${specificItem}`;
    }

    const tax = Math.ceil(totalCostBeforeTaxes * taxes);
    const totalCostAfterTaxes: number = totalCostBeforeTaxes + tax;
    restaurant.budget -= totalCostAfterTaxes;
    const stockpile = warehouse.find(x => x.name.toLowerCase() === specificItem.toLowerCase());
    if (stockpile != undefined) {
        stockpile.quantity = stockpile.quantity + parseInt(amount);
    } else {
        warehouse.push({ name: specificItem, quantity: parseInt(amount) });
    }
    const output = `We ordered ${parseInt(amount)}x ${specificItem} and current restaurant budget is ${restaurant.budget}`;
    return [output, tax];
}
