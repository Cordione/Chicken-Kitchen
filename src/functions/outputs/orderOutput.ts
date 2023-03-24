import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IOrder } from '../../Interface/IOrder';
import { IRestaurant } from '../../Interface/IRestaurant';
import { randomGenerator } from '../utils/randomGenerator';
import { spoilFood } from '../utils/spoilFood';
import { handleOrder } from '../utils/taxHandlerForOrders';

export function orderOutput(
    commandAndParameters: ICommandAndParameters,
    baseIngredients: IBaseIngredients[],
    food: IFood[],
    restaurant: IRestaurant,
    warehouse: IObjectInWarehouse[],
    informationsFromJSONFile: IInformationsFromJsonFile
) {
    const specificIngredient = commandAndParameters.parameters[0];
    const infromationsAboutOrders: IOrder[] = [];
    const output: string[] = [];
    let handledOrder;
    //Check if commandsAndParameters.parameters length is divisible by 2 with 0 reminder
    //If not return information that input is malformed
    if (commandAndParameters.parameters.length % 2 != 0) {
        return `Record is malformed, please pass equal amount of parameters for orders and quantities`;
    } else if (commandAndParameters.parameters.length % 2 == 0) {
        const halfOfLength = commandAndParameters.parameters.length / 2;
        //create array of orders with quantities
        for (let i = 0; i < commandAndParameters.parameters.length; i++) {
            //Had to handle it this way
            //i+2 was breaking a program.
            if (i % 2 == 0) {
                const orderName = commandAndParameters.parameters[i];
                const orderQuantity = parseInt(commandAndParameters.parameters[i + 1]);
                infromationsAboutOrders.push({ name: orderName, quantity: orderQuantity, tax: 0, totalCostWithTax: 0 });
            }
        }
        //add tax info to previous array
        for (let i = 0; i < infromationsAboutOrders.length; i++) {
            handledOrder = handleOrder(infromationsAboutOrders[i].name, infromationsAboutOrders[i].quantity.toString(), baseIngredients, food, informationsFromJSONFile);
            infromationsAboutOrders[i].tax = handledOrder[0] as number;
            infromationsAboutOrders[i].totalCostWithTax = handledOrder[1] as number;
        }
        //Verify if we have inside only indexes allowed by JSON
        for (let i = 0; i < infromationsAboutOrders.length; i++) {
            const specificItem = infromationsAboutOrders[i].name;
            const singleIngredient = baseIngredients.find(ingredient => ingredient.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
            const singleDish = food.find(dish => dish.name.trim().toLowerCase() == specificItem.trim().toLowerCase());
            if (singleIngredient == undefined && singleDish == undefined) {
                return `We recived malformed input, there's no such ingredient/dish as: ${specificItem}`;
            }
            if (singleIngredient == undefined && informationsFromJSONFile.order === 'ingredients') {
                return `We recived malformed input, there's no such ingredient as: ${specificItem}`;
            }
            if (singleDish == undefined && informationsFromJSONFile.order === 'dishes') {
                return `We recived malformed input, there's no such dish as: ${specificItem}`;
            }
        }
        //update restaurant budget & warehouse stockpile
        for (let i = 0; i < infromationsAboutOrders.length; i++) {
            restaurant.budget -= infromationsAboutOrders[i].totalCostWithTax;
            const stockpile = warehouse.find(x => x.name.toLowerCase() === infromationsAboutOrders[i].name.toLowerCase());
            if (stockpile != undefined) {
                stockpile.quantity = stockpile.quantity + infromationsAboutOrders[i].quantity;
            } else {
                warehouse.push({ name: infromationsAboutOrders[i].name, quantity: infromationsAboutOrders[i].quantity });
            }
            output.push(`We ordered ${infromationsAboutOrders[i].quantity}x ${infromationsAboutOrders[i].name} and current restaurant budget is ${restaurant.budget}`);
        }
        //Check if any food was spoiled
    }
    const spoiledFood = spoilFood(baseIngredients, warehouse, informationsFromJSONFile, randomGenerator);
    const taxMoney = infromationsAboutOrders.map(x => x.tax);
    const totalTaxMoney = taxMoney.reduce((a, b) => a + b, 0);

    return [output.join(', '), totalTaxMoney, spoiledFood];
}
