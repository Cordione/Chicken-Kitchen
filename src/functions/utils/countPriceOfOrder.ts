import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IMaterials } from '../../Interface/IMaterials';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { foodParser } from '../parsers/foodParser';

export function countPriceOfOrder(food: IFood[], baseIngredients: IBaseIngredients[]) {
    food.map(element => {
        const requiredRawIngredientsNames: string[] = [];
        const rawIngredientsWithQuantities: IMaterials[] = [];
        let orderCost: number = 0;
        const orderedFood = food.find(x => x.name.toLowerCase().includes(element.name.toLowerCase())) as IFood;
        const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);

        while (orderedFoodIngredients.length > 0) {
            const baseIngredient = baseIngredients.find(x => x.name === orderedFoodIngredients[0]);
            if (baseIngredient) {
                orderCost += baseIngredient.cost;
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

        element.price = orderCost;
        element.rawIngredients = requiredRawIngredientsNames
    });
}
// console.log(countPriceOfOrder(foodParser('./src/csv_files/food.csv'), baseIngredientsParser('./src/csv_files/baseIngredients.csv')));
