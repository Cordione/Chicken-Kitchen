import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';

export function handleOrder(specificItem: string, amount: string, baseIngredients: IBaseIngredients[], food: IFood[], informationsFromJSONFile: IInformationsFromJsonFile) {
    //

    let costBeforeTaxes = 0;
    const singleIngredient = baseIngredients.find(ingredient => ingredient.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const singleDish = food.find(dish => dish.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
    const taxes: number = informationsFromJSONFile.transactionTax;

    if (singleIngredient == undefined && singleDish == undefined) {
        return `We recived malformed input, there's no such ingredient/dish as: ${specificItem}`;
    } else if (singleIngredient != undefined) {
        if (informationsFromJSONFile.order === 'ingredients' || informationsFromJSONFile.order === 'all') {
            costBeforeTaxes = singleIngredient.cost;
        }
    } else if (singleDish != undefined) {
        if (informationsFromJSONFile.order === 'dishes' || informationsFromJSONFile.order === 'all') {
            costBeforeTaxes = singleDish.price;
        }
    }

    const tax = Math.ceil(costBeforeTaxes * taxes);
    const totalCostAfterTaxes: number = parseInt(amount) * (costBeforeTaxes + tax);

    return [tax, totalCostAfterTaxes];
}
