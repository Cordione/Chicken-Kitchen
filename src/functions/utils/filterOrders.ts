import { ICommandAndParameters } from "../../Interface/ICommandAndParameters";

export function filterOrders(commandAndParameters: ICommandAndParameters){
    const foodList: string[] =[]
    if (commandAndParameters.parameters != undefined) {
        const halfOfTheArray: number = Math.floor(commandAndParameters.parameters?.length / 2);
        for (let index = halfOfTheArray; index < commandAndParameters.parameters.length; index++) {
            foodList.push(commandAndParameters.parameters[index]);
        }
    }
    return foodList
}