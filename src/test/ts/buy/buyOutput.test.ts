import { buyOutput } from '../../../functions/outputs/buyOutput';
import { baseIngredientsParser } from '../../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../../functions/parsers/customersParser';
import { foodParser } from '../../../functions/parsers/foodParser';
import { warehouseParser } from '../../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../../functions/utils/commandJSONFileOutput';
import { IRestaurant } from '../../../Interface/IRestaurant';

describe('Buy Output Tests', () => {
    test(`Buy, John Doe, Fries -> invalid, unknown customer`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouse.csv', allIngredients, json);

        //when
        const result = buyOutput({ command: 'table', parameters: ['John Doe', 'Fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        //then
        expect(result).toContain(`Sorry we don't have information about your alergies John Doe,so we cannot fulfil your order`);
    });

    test(`Buy, Adam Smith, Princess Chicken -> invalid, no alergies, can't afford it`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;

        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouse.csv', allIngredients, json);
        //when
        const result = buyOutput({ command: 'table', parameters: ['Adam Smith', 'Princess Chicken'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        //then
        expect(result).toEqual(`Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117`);
    });

    test(`Buy, Alexandra Smith, Princess Chicken -> invalid, no alergies, can afford it, missing ingredients`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseEmpty.csv', allIngredients, json);
        //when
        const result = buyOutput({ command: 'table', parameters: ['Alexandra Smith', 'Princess Chicken'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse, json);
        //then
        expect(result).toContain(`Sorry we're out of supplies. Missing: Asparagus, Chicken, Honey, Milk`);
    });
});
