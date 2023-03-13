import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { doesFileExists } from '../utils/doesFileExists';
import { updateWarehouseStateAndReturnWhatWasWasted } from '../utils/updateWarehouseState';
import { baseIngredientsParser } from './baseIngredientsParser';
import { createRawArray } from './utils/createRawArray';
import { trimMe } from './utils/trimMe';

export function warehouseParser(sourceString: string, baseIngredients: IBaseIngredients[], informationsFromJsonFile: IInformationsFromJsonFile): IObjectInWarehouse[] {
    //Warehouse parser should have sourceString with input.
    //As we gonna have in either cases [{param1, param2} ...], we create interface for it, then we import it IObjectInWarehouse
    //We also need array to store this n interfaces (content will be EACH of baseIngredients and food orders)
    let warehouseStockpile: IObjectInWarehouse[] = [];
    //We have to verify if this source string leads us to file
    const doesFileExist = doesFileExists(sourceString);
    //If yes -> take data and parse it
    if (doesFileExist) {
        const rawArray = createRawArray(sourceString);
        const innerWarehouseStockpile: IObjectInWarehouse[] = [];

        for (let index = 0; index < rawArray.length; index++) {
            const singleLine = rawArray[index].filter(x => x != '');
            const secondToNColumn = trimMe(singleLine, 0);
            if (singleLine.length > 1) {
                innerWarehouseStockpile.push({ name: singleLine[0], quantity: parseFloat(secondToNColumn[0]) });
                warehouseStockpile.push({ name: singleLine[0], quantity: parseFloat(secondToNColumn[0]) });
            }
        }
    }
    //If no -> take default data
    else {
        baseIngredients.forEach(ingredient => {
            //safety check if we'll recive less max quantity than default quantity
            if (informationsFromJsonFile.maxIngredientType > 5) {
                warehouseStockpile.push({ name: ingredient.name, quantity: 5 });
            } else {
                warehouseStockpile.push({ name: ingredient.name, quantity: informationsFromJsonFile.maxIngredientType });
            }
        });
    }
    return warehouseStockpile.filter(x => x.quantity > 0);
}

// console.log(warehouseParser('./src/csv_files/warehouse.csv', baseIngredientsParser('./src/csv_files/baseIngredients.csv')));
