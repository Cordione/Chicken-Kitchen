import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IMaterials } from '../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { customersParser } from '../parsers/customersParser';
import { foodParser } from '../parsers/foodParser';
import { commandJSONFileOutput } from './commandJSONFileOutput';
import { countRawMaterials } from './countExtraMaterials';
import { randomGenerator } from './randomGenerator';
import { spoilFood } from './spoilFood';

export function informationsAboutOrders(
    commandAndParameters: ICommandAndParameters,
    customers: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    warehouse: IObjectInWarehouse[],
    json: IInformationsFromJsonFile
) {
    const specificOrders: ISpecificOrder[] = [];
    const isAlergicTo: string[][] = [];
    const orderedUnavailableFood: string[] = [];
    const missingIngredients: IMaterials[] = [];
    const whatTechnicalyWasUsed: IMaterials[] = [];

    const neededRawMaterialsWithQuantities: IMaterials[] = [];
    const usedMaterialsWithQuantities: IMaterials[] = [];
    const usedMaterialsNames: string[] = [];
    const extraMaterials: IMaterials[] = [];
    const allSpoiledFood: IObjectInWarehouse[] = [];

    if (commandAndParameters.parameters != undefined) {
        const halfOfTheArray: number = Math.floor(commandAndParameters.parameters?.length / 2);
        for (let i = 0; i < halfOfTheArray; i++) {
            const specific = commandAndParameters.parameters[i];
            const specificCustomer = customers.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
            const alergies = specificCustomer?.alergies;
            const specificOrder = commandAndParameters.parameters[halfOfTheArray + i];
            const orderedFood = food.find(x => x.name.toLowerCase().includes(specificOrder.toLowerCase())) as IFood;
            const orderedFoodIngredients = orderedFood?.ingerdients.map(ingredient => ingredient);
            const knownOrder = food.find(x => x.name.toLowerCase() == specificOrder.toLowerCase());
            let iterations: number = 0;
            if (knownOrder) {
                specificOrders.push({ name: orderedFood.name, price: orderedFood.price });
                while (orderedFoodIngredients.length > 0) {
                    const dishInWarehouse = warehouse.find(x => x.name.toLowerCase() === specificOrder.toLowerCase());
                    const partialOrder = warehouse.find(x => x.name.toLowerCase() === orderedFoodIngredients[0].toLowerCase());
                    //Gonna have to expand this by output of function counting spoiled materials
                    const helpingArray = usedMaterialsNames.map(x => x);
                    let howManyOfThemAreReserved = helpingArray.filter(x => x.toLowerCase() === specificOrder.toLowerCase()).length;
                    let howManySubIngredientsAreReserved = helpingArray.filter(x => x.toLowerCase() === partialOrder?.name.toLowerCase());
                    if (dishInWarehouse && dishInWarehouse.quantity > howManyOfThemAreReserved) {
                        usedMaterialsNames.push(dishInWarehouse.name);
                        break;
                    } else {
                        const isPartialOrderBaseIngredient = baseIngredients.find(x => x.name.toLowerCase() === partialOrder?.name.toLowerCase());
                        if (isPartialOrderBaseIngredient) {
                            const spoiledFood = spoilFood(baseIngredients, warehouse, json, randomGenerator);
                            //store information about spoiled food
                            for (let i = 0; i < spoiledFood.length; i++) {
                                const alreadyOnList = allSpoiledFood.find(x => x.name.toLowerCase() === spoiledFood[i].name.toLowerCase());
                                if (alreadyOnList) {
                                    alreadyOnList.quantity++;
                                } else {
                                    allSpoiledFood.push({ name: spoiledFood[i].name, quantity: 1 });
                                }
                            }
                            for (let i = 0; i < allSpoiledFood.length; i++) {
                                helpingArray.push(allSpoiledFood[i].name);
                            }
                            howManyOfThemAreReserved = helpingArray.filter(x => x.toLowerCase() === specificOrder.toLowerCase()).length;
                            howManySubIngredientsAreReserved = helpingArray.filter(x => x.toLowerCase() === partialOrder?.name.toLowerCase());
                            iterations++;
                        }
                        if (partialOrder && partialOrder.quantity > howManySubIngredientsAreReserved.length) {
                            usedMaterialsNames.push(partialOrder.name);
                        } else if (partialOrder == undefined || partialOrder.quantity <= howManySubIngredientsAreReserved.length) {
                            const baseIngredient = baseIngredients.find(x => x.name.toLowerCase() === orderedFoodIngredients[0].toLowerCase());
                            if (baseIngredient == undefined) {
                                const subIngredient = food.find(x => x.name === orderedFoodIngredients[0]);
                                const subIngredientIng = subIngredient?.ingerdients;
                                if (subIngredientIng != undefined) {
                                    for (const ingerdient of subIngredientIng) {
                                        orderedFoodIngredients.push(ingerdient);
                                    }
                                }
                            }
                        }
                        orderedFoodIngredients.splice(0, 1);
                    }
                }
                isAlergicTo.push(orderedFood.rawIngredients.filter(x => alergies?.includes(x)));
                for (let index = 0; index < orderedFood.rawIngredients.length; index++) {
                    const raw = neededRawMaterialsWithQuantities.find(x => orderedFood.rawIngredients[index].toLowerCase() == x.name.toLowerCase());
                    if (raw == undefined) {
                        neededRawMaterialsWithQuantities.push({ name: orderedFood.rawIngredients[index], quantity: 1 });
                    } else {
                        raw.quantity++;
                    }
                }
            } else {
                orderedUnavailableFood.push(`Sorry we don't serve: ${specificOrder}`);
            }
        }
        for (let index = 0; index < usedMaterialsNames.length; index++) {
            const used = usedMaterialsWithQuantities.find(x => x.name.toLowerCase() == usedMaterialsNames[index].toLowerCase());
            if (used != undefined) {
                used.quantity++;
            } else {
                usedMaterialsWithQuantities.push({ name: usedMaterialsNames[index], quantity: 1 });
            }
        }
        //convert dishes to raw mats (extra materials)
        const extraMaterialArray: IMaterials[][] = [];
        for (let index = 0; index < usedMaterialsWithQuantities.length; index++) {
            const findFood = food.find(x => x.name.toLowerCase() == usedMaterialsWithQuantities[index].name.toLowerCase());
            const times = usedMaterialsWithQuantities[index].quantity;
            if (findFood != undefined) {
                for (let i = 0; i < times; i++) {
                    const extraMats = countRawMaterials(findFood, food, baseIngredients);
                    extraMaterialArray.push(extraMats);
                }
            }
        }
        const anotherUsefulArray: IMaterials[] = [];
        for (let i = 0; i < extraMaterialArray.length; i++) {
            for (let j = 0; j < extraMaterialArray[i].length; j++) {
                const alreadyOnList = anotherUsefulArray.find(x => x.name.toLowerCase() === extraMaterialArray[i][j].name.toLowerCase());
                if (alreadyOnList) {
                    alreadyOnList.quantity++;
                } else {
                    anotherUsefulArray.push({ name: extraMaterialArray[i][j].name, quantity: 1 });
                }
            }
        }

        for (const element of usedMaterialsWithQuantities) {
            const baseIng = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
            if (baseIng) {
                whatTechnicalyWasUsed.push({ name: element.name, quantity: element.quantity });
            }
        }

        for (let index = 0; index < anotherUsefulArray.length; index++) {
            const exists = whatTechnicalyWasUsed.find(x => x.name.toLowerCase() == anotherUsefulArray[index].name.toLowerCase());
            if (exists == undefined) {
                whatTechnicalyWasUsed.push({ name: anotherUsefulArray[index].name, quantity: anotherUsefulArray[index].quantity });
            } else {
                exists.quantity += anotherUsefulArray[index].quantity;
            }
        }
        // Sorted Arrays
        const whatSorted = whatTechnicalyWasUsed.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        const neededSorted = neededRawMaterialsWithQuantities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name));

        // Find missing ingredients

        for (let index = 0; index < neededSorted.length; index++) {
            const whatIngredient = whatSorted.find(x => x.name.toLowerCase() === neededSorted[index].name.toLowerCase());
            if (whatIngredient) {
                if (whatIngredient.quantity < neededSorted[index].quantity) {
                    missingIngredients.push({ name: neededSorted[index].name, quantity: neededSorted[index].quantity - whatIngredient.quantity });
                }
            } else {
                missingIngredients.push({ name: neededSorted[index].name, quantity: neededSorted[index].quantity });
            }
        }
    }
    return [specificOrders, isAlergicTo, orderedUnavailableFood, missingIngredients, usedMaterialsWithQuantities, warehouse, allSpoiledFood];
}
// const jsonSource = '../../json/allEnabled.json';
// const json = commandJSONFileOutput(jsonSource);
// console.log(
//     informationsAboutOrders(
//         { command: 'a', parameters: ['Alexandra Smith', 'Adam Smith', 'emperor chicken', 'fries'] },
//         customersParser('./src/csv_files/customersAlergies.csv'),
//         foodParser('./src/csv_files/food.csv'),
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
//         [
//             { name: 'Asparagus', quantity: 5 },
//             { name: 'Milk', quantity: 5 },
//             { name: 'Honey', quantity: 5 },
//             { name: 'Tomatoes', quantity: 5 },
//             { name: 'Pickles', quantity: 5 },
//             { name: 'Feta', quantity: 5 },
//             { name: 'princess chicken', quantity: 0 },
//             { name: 'Fries', quantity: 0 },
//             { name: 'Potatoes', quantity: 5 },
//             { name: 'Tuna', quantity: 5 },
//             { name: 'Chocolate', quantity: 5 },
//             { name: 'chicken', quantity: 5 },
//             { name: 'water', quantity: 5 },
//             { name: 'paprika', quantity: 5 },
//             { name: 'garlic', quantity: 5 },
//             { name: 'smashed potatoes', quantity: 5 },
//         ],
//         json
//     )
// );
// console.log(
//     informationsAboutOrders(
//         { command: 'a', parameters: ['Alexandra Smith', 'emperor chicken'] },
//         customersParser('./src/csv_files/customersAlergies.csv'),
//         foodParser('./src/csv_files/food.csv'),
//         baseIngredientsParser('./src/csv_files/baseIngredients.csv'),
//         [
//             { name: 'Asparagus', quantity: 3 },
//             { name: 'Chicken', quantity: 1 },
//             { name: 'Chocolate', quantity: 1 },
//             { name: 'Feta', quantity: 1 },
//             { name: 'Garlic', quantity: 1 },
//             { name: 'Honey', quantity: 3 },
//             { name: 'Milk', quantity: 3 },
//             { name: 'Paprika', quantity: 1 },
//             { name: 'Pickles', quantity: 1 },
//             { name: 'Potatoes', quantity: 1 },
//             { name: 'Tomatoes', quantity: 1 },
//             { name: 'Tuna', quantity: 1 },
//             { name: 'Water', quantity: 1 }
//         ],
//         json
//     )
// );
