import { buyEverythingIsOk } from '../../../functions/outputs/buy/buyEverythingIsOk';
import { buyOutput } from '../../../functions/outputs/buyOutput';
import { baseIngredientsParser } from '../../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../../functions/parsers/customersParser';
import { foodParser } from '../../../functions/parsers/foodParser';
import { warehouseParser } from '../../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../../functions/utils/commandJSONFileOutput';
import { randomGenerator } from '../../../functions/utils/randomGenerator';
import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { IFood } from '../../../Interface/IFood';
import { IMaterials } from '../../../Interface/IMaterials';
import { IRestaurant } from '../../../Interface/IRestaurant';

describe('Buy Everything is ok Tests', () => {
    test(`Buy, Adam Smith, Fries -> valid, no alergies, can afford it, will tip`, () => {
        //given
        const specificCustomer: ICustomerAlergies = { customerName: 'Adam Smith', budget: 100, alergies: [], sucessfulAppearances: 0 };
        const specificDish: IFood = { name: 'fries', ingerdients: ['potatoes'], price: 3, rawIngredients: ['potatoes'] };
        const orderCost = 4;
        const orderTax = 1;
        const discountInMoney = 0;
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 1 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = buyEverythingIsOk(
            specificCustomer,
            specificDish,
            orderCost,
            orderTax,
            discountInMoney,
            restaurant,
            informationAboutUsedMaterials,
            warehouse,
            json,
            jest.fn<number, number[]>().mockReturnValueOnce(57).mockReturnValueOnce(0.05)
        ); //then
        expect(result).toContain('Adam Smith has budget: 100 -> wants to order fries, which cost: 4: success -> customer decided to tip: 1, Restaurant gets: 4, transactionTax: 1.');
    });
    test(`Buy, Adam Smith, Fries -> valid, no alergies, can afford it, won't tip`, () => {
        //given
        const specificCustomer: ICustomerAlergies = { customerName: 'Adam Smith', budget: 100, alergies: [], sucessfulAppearances: 0 };
        const specificDish: IFood = { name: 'fries', ingerdients: ['potatoes'], price: 3, rawIngredients: ['potatoes'] };
        const orderCost = 4;
        const orderTax = 1;
        const discountInMoney = 0;
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 1 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = buyEverythingIsOk(
            specificCustomer,
            specificDish,
            orderCost,
            orderTax,
            discountInMoney,
            restaurant,
            informationAboutUsedMaterials,
            warehouse,
            json,
            jest.fn<number, number[]>().mockReturnValueOnce(7).mockReturnValueOnce(0.05)
        ); //then
        expect(result).toContain('Adam Smith has budget: 100 -> wants to order fries, which cost: 4: success -> Restaurant gets: 3, transactionTax: 1.');
    });
    test(`Buy, Adam Smith, Fries -> valid, no alergies, can afford it, will tip 5% and have 95 money left`, () => {
        //given
        const specificCustomer: ICustomerAlergies = { customerName: 'Adam Smith', budget: 200, alergies: [], sucessfulAppearances: 0 };
        const specificDish: IFood = { name: 'fries', ingerdients: ['potatoes'], price: 3, rawIngredients: ['potatoes'] };
        const orderCost = 100;
        const orderTax = 10;
        const discountInMoney = 0;
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 1 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = buyEverythingIsOk(
            specificCustomer,
            specificDish,
            orderCost,
            orderTax,
            discountInMoney,
            restaurant,
            informationAboutUsedMaterials,
            warehouse,
            json,
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.05)
        ); //then
        expect(result).toContain('Adam Smith has budget: 200 -> wants to order fries, which cost: 100: success -> customer decided to tip: 5, Restaurant gets: 95, transactionTax: 10.');
        expect(specificCustomer.budget).toEqual(95);
    });
    test(`Buy, Adam Smith, Fries -> valid, no alergies, can afford it, will tip 10% and have 90 money left`, () => {
        //given
        const specificCustomer: ICustomerAlergies = { customerName: 'Adam Smith', budget: 200, alergies: [], sucessfulAppearances: 0 };
        const specificDish: IFood = { name: 'fries', ingerdients: ['potatoes'], price: 3, rawIngredients: ['potatoes'] };
        const orderCost = 100;
        const orderTax = 10;
        const discountInMoney = 0;
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 1 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = buyEverythingIsOk(
            specificCustomer,
            specificDish,
            orderCost,
            orderTax,
            discountInMoney,
            restaurant,
            informationAboutUsedMaterials,
            warehouse,
            json,
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.1)
        ); //then
        expect(result).toContain('Adam Smith has budget: 200 -> wants to order fries, which cost: 100: success -> customer decided to tip: 10, Restaurant gets: 100, transactionTax: 10.');
        expect(specificCustomer.budget).toEqual(90);
    });
    test(`Buy, Adam Smith, Fries -> valid, no alergies, can afford it, want tip 10% but don't have enough money so will tip 5%`, () => {
        //given
        const specificCustomer: ICustomerAlergies = { customerName: 'Adam Smith', budget: 105, alergies: [], sucessfulAppearances: 0 };
        const specificDish: IFood = { name: 'fries', ingerdients: ['potatoes'], price: 3, rawIngredients: ['potatoes'] };
        const orderCost = 100;
        const orderTax = 10;
        const discountInMoney = 0;
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 1 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = buyEverythingIsOk(
            specificCustomer,
            specificDish,
            orderCost,
            orderTax,
            discountInMoney,
            restaurant,
            informationAboutUsedMaterials,
            warehouse,
            json,
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.1)
        ); //then
        expect(result).toContain('Adam Smith has budget: 105 -> wants to order fries, which cost: 100: success -> customer decided to tip: 5, Restaurant gets: 95, transactionTax: 10.');
        expect(specificCustomer.budget).toEqual(0);
    });
});
