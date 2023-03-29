import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';

export function handleOrder(specificItem: string, amount: string, baseIngredients: IBaseIngredients[], food: IFood[], informationsFromJSONFile: IInformationsFromJsonFile) {
    //

    let totalCostBeforeTaxes = 0;
    const singleIngredient = baseIngredients.find(ingredient => ingredient.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const singleDish = food.find(dish => dish.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const taxes: number = informationsFromJSONFile.transactionTax 

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
    const tax = Math.ceil(totalCostBeforeTaxes * taxes);
    const totalCostAfterTaxes: number = totalCostBeforeTaxes + tax;

    return [tax, totalCostAfterTaxes];
}
