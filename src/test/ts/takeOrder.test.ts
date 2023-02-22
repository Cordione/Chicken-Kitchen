import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { takeOrder } from '../../functions/takeOrder';
import { IRestaurant } from '../../Interface/IRestaurant';

describe('Take order tests', () => {
    test('Julie Mirage should be able to buy fish in water.', () => {
        //given
        const customer = 'Julie mirage';
        const order = 'Fish iN WaTeR';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual('Julie Mirage have budget: 100 -> wants to order Fish In Water, which cost: 49.40: success');
    });
    test('Elon Carousel should not be able to buy fish in water.', () => {
        //given
        const customer = 'Elon Carousel';
        const order = 'fish in water';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Elon Carousel have budget: 50 -> wants to order Fish In Water -> can't order, alergic to: vinegar`);
    });
    test('Julie Mirage should not be able to buy Emperor Chicken -> to expensive.', () => {
        //given
        const customer = 'Julie Mirage';
        const order = 'Emperor Chicken';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Julie Mirage have budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 369.2`);
    });
    test('Bernard Unfortunate should not be able to buy fish in water.', () => {
        //given
        const customer = 'Bernard Unfortunate';
        const order = 'Emperor Chicken';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Bernard Unfortunate have budget: 15 -> wants to order Emperor Chicken -> can't order, food cost 369.2, alergic to: potatoes`);
    });
    test('Unknown customer want to place an order', () => {
        //given
        const customer = 'Jaques Chirac';
        const order = 'Emperor Chicken';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Sorry we can't handle your request Jaques Chirac, we don't know about your alergies.`);
    });
    test('Bernard Unfortunate want to order pretzles', () => {
        //given
        const customer = 'Bernard Unfortunate';
        const order = 'Pretzles';
        const customers = customersParser('./src/test/csv/customersAlergies.csv');
        const food = foodParser('./src/test/csv/food.csv');
        const baseIngredients = baseIngredientsParser('./src/test/csv/baseIngredients.csv');
        const command = 'buy';
        const restaurant: IRestaurant = {
            budget: 500,
        };
        //when
        const result = takeOrder(command, customer, order, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Sorry we don't serve: Pretzles`);
    });
});
