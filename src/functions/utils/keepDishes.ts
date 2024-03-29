import { IFood } from '../../Interface/IFood';
import { IInformationsFromJsonFile } from '../../Interface/IInformationsFromJsonFIle';
import { IObjectInWarehouse } from '../../Interface/IObjectInWarehouse';
import { IRestaurant } from '../../Interface/IRestaurant';
import { ISpecificOrder } from '../../Interface/ISpecificOrder';

export function keepDishes(informationAboutOrdersAndItsPrice: ISpecificOrder[], restaurant: IRestaurant, warehouse: IObjectInWarehouse[], informationsFromJsonFile: IInformationsFromJsonFile) {
    //Was prepared to return output of wasted thou it's not introduced in task by itself
    // const output: string[] = [];

    //Iterate throught specific orders
    const keptDishes: IObjectInWarehouse[] = [];

    for (const element of informationAboutOrdersAndItsPrice) {
        const quarterPrice = Math.ceil(element.price / 4);
        const specificDishInWarehouse = warehouse.find(x => x.name.toLowerCase() === element.name.toLowerCase());
        const maxDishes = informationsFromJsonFile.maxDishType;
        const numericValue = typeof informationsFromJsonFile.dishWithAllergies === 'number' ? informationsFromJsonFile.dishWithAllergies : 0;
        //IF we can afford to place it in warehouse (buget is more then 25% dish cost)
        console.log(numericValue);

        if (element.price > numericValue) {

            if (quarterPrice <= restaurant.budget) {
                //Reduce restaurant buget by 25%
                restaurant.budget -= quarterPrice;
                if (specificDishInWarehouse == undefined) {
                    //IF warehouse will have less specific dish than maximum we put it inside
                    warehouse.push({ name: element.name, quantity: 1 });

                    // output.push(`There were no dishes in storage of that type, we added ${element.name}. Thou we had to spend extra money: ${quarterPrice} on keeping dish warm`);
                } else {
                    const canWePutItIntoWarehouse = specificDishInWarehouse?.quantity < maxDishes;
                    if (canWePutItIntoWarehouse) {
                        specificDishInWarehouse.quantity++;
                        // output.push(
                        //     `There were already dishes in storage of that type, we added ${element.name}, now we've: ${specificDishInWarehouse.quantity}. Thou we had to spend extra money: ${quarterPrice} on keeping dish warm`
                        // );
                    }
                }
                const alreadyOnList = keptDishes.find(x => x.name.toLowerCase() === element.name.toLowerCase());
                if (alreadyOnList) {
                    alreadyOnList.quantity++;
                } else {
                    keptDishes.push({ name: element.name, quantity: 1 });
                }
            }
        }
    }

    return keptDishes;
}
