import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

export function totalMoneyThrownToTrash(trash: IObjectInWarehouse[][], food: IFood[], baseIngredients: IBaseIngredients[], wasteTax: number) {
    let wastedIngredientCost = 0;
    const fine = 20;
    //flat this array, we no need to have it as [][]
    //Iterate through it
    //add to totalMoneyCost with price of element * it's quantity
    trash.flat().forEach(el => {
        const isBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === el.name.toLowerCase());
        const isDish = food.find(x => x.name.toLowerCase() === el.name.toLowerCase());
        if (isBaseIngredient) wastedIngredientCost += el.quantity * isBaseIngredient.cost;
        if (isDish) wastedIngredientCost += el.quantity * isDish.price;
    });
    const tax = wastedIngredientCost * (wasteTax / 100);
    const howManyTimesWeExcededMax = Math.floor(tax / 100);
    const totalWasteTaxToPay = Math.ceil(tax + fine * howManyTimesWeExcededMax)
    return totalWasteTaxToPay;
}
