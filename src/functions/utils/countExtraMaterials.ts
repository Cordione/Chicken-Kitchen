import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IMaterials } from '../../Interface/IMaterials';

export function countRawMaterials(specificFood: IFood, food: IFood[], baseIngredients: IBaseIngredients[]) {
    const requiredRawIngredientsNames: string[] = [];
    const rawIngredientsWithQuantities: IMaterials[] = [];
    const orderedFood = food.find(x => x.name.toLowerCase().includes(specificFood.name.toLowerCase())) as IFood;
    const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);

    while (orderedFoodIngredients.length > 0) {
        const baseIngredient = baseIngredients.find(x => x.name === orderedFoodIngredients[0]);
        if (baseIngredient) {
            const alreadyOnList = rawIngredientsWithQuantities.find(x => x.name.toLowerCase() === baseIngredient.name.toLowerCase());
            if (alreadyOnList) {
                alreadyOnList.quantity++;
            } else {
                rawIngredientsWithQuantities.push({ name: baseIngredient.name.toLowerCase(), quantity: 1 });
            }
            requiredRawIngredientsNames.push(baseIngredient.name);
        } else {
            const subIngredient = food.find(x => x.name === orderedFoodIngredients[0]);
            const subIngredientIng = subIngredient?.ingerdients;
            if (subIngredientIng != undefined) {
                for (const ingerdient of subIngredientIng) {
                    orderedFoodIngredients.push(ingerdient);
                }
            }
        }
        orderedFoodIngredients.splice(0, 1);
    }
    return rawIngredientsWithQuantities;
}
