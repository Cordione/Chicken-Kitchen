import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';

export function orderOutput(
    commandAndParameters: ICommandAndParameters,
    baseIngredients: IBaseIngredients[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    if (commandAndParameters.parameters != undefined) {
        const specificIngredient = commandAndParameters.parameters[0];
        const amount = commandAndParameters.parameters[1];
        const singleUnit = baseIngredients.find(ingredient => {
            if (ingredient.name.trim().toLowerCase() == specificIngredient.trim().toLowerCase()) {
                return ingredient;
            }
        });
        //Reduce restaurant budget by recived order
        const totalCostBeforeTaxes: number = Math.ceil(singleUnit!.cost * parseFloat(amount));
        const taxes: number = informationsFromJSONFile.transactionTax != undefined ? parseFloat(`0.${informationsFromJSONFile.transactionTax}`) : 0.1;
        const tax = Math.ceil(totalCostBeforeTaxes * taxes);
        const totalCostAfterTaxes: number = totalCostBeforeTaxes + tax;
        restaurant.budget -= totalCostAfterTaxes;
        const stockpile = warehouse.find(x => x.name.toLowerCase() === specificIngredient.toLowerCase());
        if (stockpile != undefined) {
            stockpile.quantity = stockpile.quantity + parseInt(amount);
        }
        const output = `We ordered ${parseFloat(amount)}x ${specificIngredient} and current restaurant budget is ${restaurant.budget}`;
        return [output, tax];
    }
}
