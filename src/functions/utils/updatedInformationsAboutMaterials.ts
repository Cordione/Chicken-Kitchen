import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { IFood } from '../../Interface/IFood';
import { IMaterials } from '../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';

export function updatedInfromationsAboutMaterials(informationAboutUsedMaterials: IMaterials[], dishes: IObjectInWarehouse[], food: IFood[]) {
    for (const dish of dishes) {
        const foundDish = food.find(x => x.name.toLowerCase() === dish.name.toLowerCase());

        while (foundDish!.ingerdients.length > 0) {
            const isOnList = informationAboutUsedMaterials.find(x => x.name === foundDish?.ingerdients[0]);

            if (isOnList) {
                isOnList.quantity--;
            } else {
                const subIngredient = food.find(x => x.name === foundDish?.ingerdients[0]);
                const subIngredientIng = subIngredient?.ingerdients;
                if (subIngredientIng != undefined) {
                    for (const ingerdient of subIngredientIng) {
                        foundDish?.ingerdients.push(ingerdient);
                    }
                }
            }
            foundDish?.ingerdients.splice(0, 1);
        }
    }
    return informationAboutUsedMaterials.filter(x => x.quantity != 0);
}
