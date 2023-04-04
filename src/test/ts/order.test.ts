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
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(0));
        //then
        expect(result).toContain("We recived malformed input, there's no such ingredient/dish as: Julie Mirage");
    });

    test('Order test, 1 Dish - should fail', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(0));
        //then
        expect(result).toContain("We recived malformed input, there's no such ingredient as: Fries");
    });

    test('Order test, 2 ingredients, 1 quantity - shouldnt work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(0));
        //then
        expect(result).toContain('Record is malformed, please pass equal amount of parameters for orders and quantities');
    });

    test('Order test, 2 ingredients, 2 quantities - should work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(100));
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478, We ordered 2x princess chicken and current restaurant budget is 280');
    });

    test('Order test, 1 ingredient - should work', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(100));
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478');
    });

    test('1 Dish with proper json', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(100));
        //then
        expect(result).toContain('We ordered 1x Fries and current restaurant budget is 496');
    });

    test('1 Dish with proper json(all)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(100));
        //then
        expect(result).toContain('We ordered 1x Fries and current restaurant budget is 496');
    });

    test('1 ingredient with proper json(all)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(100));
        //then
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 478');
    });

    test('1 ingredient & 1 dish with wrong json(dish)', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
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
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, jest.fn<number, number[]>().mockReturnValue(1));
        //then
        expect(result).toContain("We recived malformed input, there's no such dish as: chicken");
    });

    test('1 ingredient, 1 dish with proper json, ingredient vol 0.9 dish vol 1.25', () => {
        const input: ICommandAndParameters = {
            command: 'Order',
            flag: "",
            parameters: ['chicken', '1', 'princess chicken', '1'],
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
        const rngProvider = jest.fn<number, number[]>().mockReturnValueOnce(90).mockReturnValueOnce(125);
        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json, rngProvider);
        //then
        //1 chicken: 20 + 2 taxes = 22, 22*0.9 = 19.8 , Math.ceil(19.8) = 20, 500-20 =480
        //1 princess chicken: 90 + 9 taxes = 99, 99*1.25 = 123,75 , Math.ceil(123,75) = 124, 480 - 124 = 356
        expect(result).toContain('We ordered 1x chicken and current restaurant budget is 480, We ordered 1x princess chicken and current restaurant budget is 356');
    });
});
