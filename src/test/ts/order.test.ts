import { orderOutput } from '../../functions/outputs/orderOutput';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Ordering tests', () => {
    test('Order test, malformed input', () => {
        const input: ICommandAndParameters = {
            command: 'Buy',
            parameters: ['Julie Mirage', 'fish in water'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain("We recived malformed input, there's no such ingredient/dish as: Julie Mirage");
    });
    test('Order test, 1 Dish - should fail', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['Fries', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain("We recived malformed input, there's no such ingredient as: Fries");
    });
    test('Order test, 2 ingredients, 1 quantity - shouldnt work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['chicken', '1', 'tuna'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/all.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', baseIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('Record is malformed, please pass equal amount of parameters for orders and quantities');
    });
    test('Order test, 2 ingredients, 2 quantities - should work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['chicken', '1', 'princess chicken', '2'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/all.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', baseIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478, We ordered 2x princess chicken and current restaurant budget is 280');
    });
    test('Order test, 1 ingredient - should work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['chicken', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478');
    });

    test('1 Dish with proper json', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['Fries', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/dish.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 1x Fries and current restaurant budget is 496');
    });
    test('1 Dish with proper json(all)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['Fries', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/all.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 1x Fries and current restaurant budget is 496');
    });
    test('1 ingredient with proper json(all)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['chicken', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/all.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478');
    });
    test('1 ingredient & 1 dish with wrong json(dish)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            parameters: ['chicken', '1', 'princess Chicken', '1'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/dish.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        console.log(json.order);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain("We recived malformed input, there's no such dish as: chicken");
    });
});
