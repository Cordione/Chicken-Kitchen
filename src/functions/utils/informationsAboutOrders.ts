import { IBaseIngredients } from '../../Interface/IBaseIngredients';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';
import { IFood } from '../../Interface/IFood';
import { IMaterials } from '../../Interface/IMaterials';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';
import { baseIngredientsParser } from '../parsers/baseIngredientsParser';
import { customersParser } from '../parsers/customersParser';
import { foodParser } from '../parsers/foodParser';

export function informationsAboutOrders(
    commandAndParameters: ICommandAndParameters,
    customers: ICustomerAlergies[],
    food: IFood[],
    baseIngredients: IBaseIngredients[],
    warehouse: IObjectInWarehouse[]
) {
    const specificOrders: ISpecificOrder[] = [];
    const isAlergicTo: string[][] = [];
    const orderedUnavailableFood: string[] = [];
    const missingIngredients: IMaterials[] = [];

    const neededRawMaterialsWithQuantities: IMaterials[] = [];
    const usedMaterialsWithQuantities: IMaterials[] = [];
    const usedMaterialsNames: string[] = [];
    const extraMaterials: IMaterials[] = [];

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
            if (knownOrder) {
                specificOrders.push({ name: orderedFood.name, price: orderedFood.price });
                while (orderedFoodIngredients.length > 0) {
                    const dishInWarehouse = warehouse.find(x => x.name.toLowerCase() === specificOrder.toLowerCase());
                    const partialOrder = warehouse.find(x => x.name.toLowerCase() === orderedFoodIngredients[0].toLowerCase());
                    const howManyOfThemAreReserved = usedMaterialsNames.filter(x => x.toLowerCase() === specificOrder.toLowerCase()).length;
                    const howManySubIngredientsAreReserved = usedMaterialsNames.filter(x => x.toLowerCase() === partialOrder?.name.toLowerCase());
                    if (dishInWarehouse && dishInWarehouse.quantity > howManyOfThemAreReserved) {
                        usedMaterialsNames.push(dishInWarehouse.name);
                        break;
                    } else {
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
        for (let index = 0; index < usedMaterialsWithQuantities.length; index++) {
            if (usedMaterialsWithQuantities[index] != undefined) {
                const rawIngredient = baseIngredients.find(x => x.name.toLowerCase() === usedMaterialsWithQuantities[index].name.toLowerCase());
                if (rawIngredient == undefined) {
                    const findFood = food.find(x => x.name.toLowerCase() == usedMaterialsWithQuantities[index].name.toLowerCase());
                    if (findFood != undefined) {
                        for (let i = 0; i < findFood.rawIngredients.length; i++) {
                            const extra = extraMaterials.find(x => x.name.toLowerCase() === findFood.rawIngredients[i].toLowerCase());
                            if (extra == undefined) {
                                extraMaterials.push({ name: findFood.rawIngredients[i], quantity: 1 });
                            } else {
                                extra.quantity++;
                            }
                        }
                    }
                }
            }
        }
        const whatTechnicalyWasUsed: IMaterials[] = [];
        for (const element of usedMaterialsWithQuantities) {
            const baseIng = baseIngredients.find(x => x.name.toLowerCase() === element.name.toLowerCase());
            if (baseIng) {
                whatTechnicalyWasUsed.push({ name: element.name, quantity: element.quantity });
            }
        }

        for (let index = 0; index < extraMaterials.length; index++) {
            const exists = whatTechnicalyWasUsed.find(x => x.name.toLowerCase() == extraMaterials[index].name.toLowerCase());
            if (exists == undefined) {
                whatTechnicalyWasUsed.push({ name: extraMaterials[index].name, quantity: 1 });
            } else {
                exists.quantity++;
            }
        }

        // Sorted Arrays
        const whatSorted = whatTechnicalyWasUsed.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
        const neededSorted = neededRawMaterialsWithQuantities.sort((a, b) => a.name.localeCompare(b.name));

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
    return [specificOrders, isAlergicTo, orderedUnavailableFood, missingIngredients, usedMaterialsWithQuantities, warehouse];
}
// console.log(
//     informationsAboutOrders(
//         { command: 'a', parameters: ['Julie Mirage', 'Alexandra Smith', 'emperor chicken'] },
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
//             { name: 'princess chicken', quantity: 1 },
//             { name: 'Fries', quantity: 0 },
//             { name: 'Potatoes', quantity: 5 },
//             { name: 'Tuna', quantity: 5 },
//             { name: 'Chocolate', quantity: 5 },
//             { name: 'chicken', quantity: 5 },
//             { name: 'water', quantity: 5 },
//             { name: 'paprika', quantity: 5 },
//             { name: 'garlic', quantity: 5 },
//             { name: 'smashed potatoes', quantity: 5 },
//         ]
//     )
// );
