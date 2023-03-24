import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { randomGenerator } from './randomGenerator';

export function spoilFood(baseIngredients: IBaseIngredients[], warehouse: IObjectInWarehouse[], json: IInformationsFromJsonFile, random: (min: number, max: number) => number) {
    //Function is supposed to run throught all baseIngredients contained in warehouse
    //Times per ingredient equal to it's quantity
    //If any material will get spoiled, we're supposed to store information about it
    //We'll return this information outside
    const chanceToSpoil: number = json.spoilRate != undefined ? parseFloat(`0${json.spoilRate}`) : 0.1;
    const baseIngredientsInWarehouse: IObjectInWarehouse[] = [];

    if (chanceToSpoil === 0) {
        return baseIngredientsInWarehouse;
    }
    for (const element of warehouse) {
        const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
        if (isBaseIngredient) {
            for (let i = 0; i < element.quantity; i++) {
                const rand = random(0, 100);
                const isSpoiled = rand <= chanceToSpoil;
                if (isSpoiled) {
                    const alreadyOnList = baseIngredientsInWarehouse.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                    if (alreadyOnList) {
                        alreadyOnList.quantity++;
                    } else {
                        baseIngredientsInWarehouse.push({ name: element.name, quantity: 1 });
                    }
                }
            }
        }
    }
    return baseIngredientsInWarehouse;
}
