import { buyOutput } from '../../functions/outputs/buyOutput';
import { orderOutput } from '../../functions/outputs/orderOutput';
import { tableOutput } from '../../functions/outputs/tableOutput';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../functions/utils/commandJSONFileOutput';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Warehouse testing', () => {
    test('Add 10 tuna to warehouse, total quantity = 10', () => {
        //given
        const input: ICommandAndParameters = {
            command: 'order',
            parameters: ['tuna', '10'],
        };
        const restaurant: IRestaurant = {
            budget: 500,
        };

        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const food = foodParser('./src/test/csv/baseIngredients.csv');
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const warehouse = warehouseParser('./src/csv_files/warehouseEmpty.csv', allIngredients, json);

        //when
        const result = orderOutput(input, baseIngredients, food, restaurant, warehouse, json);
        //then
        expect(result).toContain('We ordered 10x tuna and current restaurant budget is 225');
        expect(warehouse[0]).toEqual({ name: 'tuna', quantity: 10 });
    });
    test('1 table -> 3 customers -> check warehouse, json - keep', () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const jsonSource = '../../json/keep.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        tableOutput(
            { command: 'table', parameters: ['barbara smith', 'bernard unfortunate', 'adam smith', 'tuna cake', 'fries', 'fries'] },
            allCustomers,
            allFood,
            allIngredients,
            restaurantMarkup,
            restaurant,
            warehouse,
            json
        );
        const tunacake = warehouse.find(x => x.name === 'Tuna Cake');
        const fries = warehouse.find(x => x.name === 'Fries');
        expect(tunacake).toEqual({ name: 'Tuna Cake', quantity: 1 });
        expect(fries).toEqual({ name: 'Fries', quantity: 2 });
    });
    test('3 buy -> 3 customers -> check warehouse, json - keep', () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const jsonSource = '../../json/keep.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        buyOutput({ command: 'buy', parameters: ['barbara smith', 'tuna cake'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        buyOutput({ command: 'buy', parameters: ['bernard unfortunate', 'fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        buyOutput({ command: 'buy', parameters: ['adam smith', 'fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        const tunacake = warehouse.find(x => x.name === 'Tuna Cake');
        const fries = warehouse.find(x => x.name === 'Fries');
        expect(tunacake).toEqual({ name: 'Tuna Cake', quantity: 1 });
        expect(fries).toEqual({ name: 'Fries', quantity: 0 });
    });
    test('3 buy -> 3 customers -> check warehouse, json - number', () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const jsonSource = '../../json/number.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        buyOutput({ command: 'buy', parameters: ['barbara smith', 'tuna cake'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        buyOutput({ command: 'buy', parameters: ['bernard unfortunate', 'fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        buyOutput({ command: 'buy', parameters: ['adam smith', 'fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        const tunacake = warehouse.find(x => x.name === 'Tuna Cake');
        const fries = warehouse.find(x => x.name === 'Fries');

        expect(tunacake).toEqual({ name: 'Tuna Cake', quantity: 1 });
        expect(fries).toEqual(undefined);
    });
});
