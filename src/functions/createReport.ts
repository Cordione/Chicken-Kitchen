import { saveFile } from './saveFile';

export function createReport(restaurantBudgetIterations: number[], outputArray: string[]) {
    //Function should take array of strings as parameter
    //First parameter should be array containing restaurant budget changes
    //Second array should contain other things which will happend i.e orders of food.

    //is Restaurant Bankrupt
    let isRestaurantBankrupt: boolean = false;
    //Array to store all outputs before writing a file.
    const finalArray: string[] = [];
    for (let index = 0; index < outputArray.length; index++) {
        if (index == 0) {
            finalArray.push(`Restaurant budget: ${restaurantBudgetIterations[0]}`);
        }
        if (!isRestaurantBankrupt) {
            finalArray.push(outputArray[index]);
        }
        if (index == outputArray.length - 1) {
            finalArray.push(`Restaurant budget: ${restaurantBudgetIterations[restaurantBudgetIterations.length - 1]}`);
        }
    }
    //Save array as file
    const saved = saveFile(finalArray);
    console.log(saved)
    return saved;
}
