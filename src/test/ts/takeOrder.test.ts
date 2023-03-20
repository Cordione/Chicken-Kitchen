import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
import { takeOrder } from '../../functions/takeOrder';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Take order tests', () => {
    test('Julie Mirage should be able to buy fish in water.', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Julie Mirage', 'fish in water'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toContain("Julie Mirage has budget: 100 -> wants to order Fish In Water, which cost: 50: success -> Restaurant gets: 45, transactionTax: 5");
    });
    test('Elon Carousel should not be able to buy fish in water.', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Elon Carousel', 'Fish in Water'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);;
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toContain("Elon Carousel has budget: 50 -> wants to order Fish In Water -> can't order, food cost 50, alergic to: vinegar");
    });
    test('Julie Mirage should not be able to buy Emperor Chicken -> to expensive.', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Julie Mirage', 'emperor chicken'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toEqual("Julie Mirage has budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 370");
    });
    test('Bernard Unfortunate should not be able to buy emperor chicken.', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Bernard Unfortunate', 'emperor chicken'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toContain("Bernard Unfortunate has budget: 15 -> wants to order Emperor Chicken -> can't order, food cost 370, alergic to: potatoes");
    });
    test('Unknown customer want to place an order', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Jaques Chirac', 'Emperor Chicken'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);

        //then
        expect(result).toEqual(`Sorry we don't have information about your alergies Jaques Chirac,so we cannot fulfil your order`);
    });
    test('Bernard Unfortunate want to order pretzles', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Bernard Unfortunate', 'Pretzels'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant, warehouse, json);
        //then
        expect(result).toEqual(`Sorry we don't serve: Pretzels`);
    });
});
