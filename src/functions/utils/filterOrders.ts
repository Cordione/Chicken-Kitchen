import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IFood } from '../../Interface/IFood';

export function filterOrders(commandAndParameters: ICommandAndParameters, food: IFood[]) {
    const foodList: string[] = [];
    if (commandAndParameters.parameters != undefined) {
        for (let index = 0; index < commandAndParameters.parameters.length; index++) {
            const specific = commandAndParameters.parameters[index];
            const specificOrder = food.find(dish => dish.name.toLowerCase() === specific.toLowerCase());
            if (specificOrder != undefined) {
                foodList.push(specificOrder.name);
            }
        }
    }
    return foodList;
}
