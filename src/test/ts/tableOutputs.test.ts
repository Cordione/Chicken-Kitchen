import { tableOutput } from '../../functions/outputs/tableOutput';
import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { warehouseParser } from '../../functions/parsers/warehouseParser';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Command Tokenizer tests', () => {
    test(`Table, John Doe, Fries -> invalid, unknown customer`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('./src/csv_files/warehouse.csv', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['John Doe', 'Fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);
        //then
        expect(result).toContain(`Error no idea what is John Doe`);
    });
    test(`Table, Adam Smith, Fries -> valid, no alergies, can afford it`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;

        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Adam Smith', 'Fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);
        //then
        expect(result).toContain(`Adam Smith, ordered Fries -> success, total cost: 3.90`);
        expect(result).toContain(`Adam Smith, ordered Fries, -> success: 3.90`);
    });
    test(`Table, Julie Mirage, Princess Chicken -> invalid, Julie can't afford it`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;

        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Julie Mirage', 'Princess Chicken'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);

        //then
        expect(result).toContain(`Julie Mirage, ordered Princess Chicken -> FAILURE`);
        expect(result).toContain(`We're sorry: Julie Mirage, we cannot provide you with table, becouse you cannot afford your order, yours budget: 100, order cost: 117.00`);
    });
    test(`Table, Alexandra Smith, Adam Smith, Irish Fish, Fries -> valid, no alergies, both can afford meal`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput(
            { command: 'table', parameters: ['Alexandra Smith', 'Adam Smith', 'Irish Fish', 'Fries'] },
            allCustomers,
            allFood,
            allIngredients,
            restaurantMarkup,
            restaurant,
            warehouse
        );

        //then
        expect(result).toContain(`Alexandra Smith, Adam Smith, ordered Irish Fish, Fries -> success, total cost: 44.20`);
        expect(result).toContain(`Alexandra Smith, ordered Irish Fish, -> success: 40.30`);
        expect(result).toContain(`Adam Smith, ordered Fries, -> success: 3.90`);
    });
    test(`Table, Alexandra Smith, Bernard Unfortunate, Irish Fish, Fries -> invalid, Bernard is alergic to potatoes`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput(
            { command: 'table', parameters: ['Alexandra Smith', 'Bernard Unfortunate', 'Irish Fish', 'Fries'] },
            allCustomers,
            allFood,
            allIngredients,
            restaurantMarkup,
            restaurant,
            warehouse
        );

        //then
        expect(result).toContain(`Alexandra Smith, Bernard Unfortunate, ordered Irish Fish, Fries -> FAILURE`);
        expect(result).toContain(`We're sorry Alexandra Smith, we cannot provide you with table, becouse other guest is alergic to his order`);
        expect(result).toContain(`We're sorry: Bernard Unfortunate, we cannot provide you with table, becouse you're alergic to: potatoes`);
    });
    test(`Table, Alexandra Smith, Adam Smith, Fries -> invalid, Every person needs something to eat`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Alexandra Smith', 'Adam Smith', 'Fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);

        //then
        expect(result).toContain(`ERROR. Every person needs something to eat.`);
    });
    test(`Table, Alexandra Smith, Fries, Irish Fish -> invalid, One person can have one type of food only`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Alexandra Smith', 'Fries', 'Irish Fish'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);

        //then
        expect(result).toContain(`ERROR. One person can have one type of food only.`);
    });
    test(`Table, Adam Smith, Adam Smith, Fries, Fries -> invalid, One person can appear only once at the table`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Adam SMith', 'Adam SMith', 'Fries', 'Fries'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);

        //then
        expect(result).toContain(`ERROR. One person can appear only once at the table.`);
    });
    test(`Table, Alexandra Smith, Princess Chicken -> invalid, no alergies, can afford it, missing ingredients`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;

        const warehouse = warehouseParser('./src/csv_files/warehouseEmpty.csv', allIngredients);
        //when
        const result = tableOutput({ command: 'table', parameters: ['Alexandra Smith', 'Princess Chicken'] }, allCustomers, allFood, allIngredients, restaurantMarkup, restaurant, warehouse);
        //then
        expect(result).toContain(`Sorry we're out of supplies. Missing: Asparagus, Chicken, Honey, Milk`);
    });
    test(`Table, Alexandra Smith, Adam Smith, Princess Chicken, Fries -> invalid, no alergies, can afford it, missing ingredients`, () => {
        //given
        const allCustomers = customersParser('./src/csv_files/customersAlergies.csv');
        const allFood = foodParser('./src/csv_files/food.csv');
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const restaurantMarkup = 1.3;
        const warehouse = warehouseParser('./src/csv_files/warehouseEmpty.csv', allIngredients);
        //when
        console.log(warehouse);

        const result = tableOutput(
            { command: 'table', parameters: ['Alexandra Smith', 'Adam SMith', 'Princess Chicken', 'fries'] },
            allCustomers,
            allFood,
            allIngredients,
            restaurantMarkup,
            restaurant,
            warehouse
        );
        //then
        expect(result).toContain(`Sorry we're out of supplies. Missing: Asparagus, Chicken, Honey, Milk, Potatoes`);
    });
});
