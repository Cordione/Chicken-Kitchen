import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { customersParser } from '../../functions/parsers/customersParser';
import { foodParser } from '../../functions/parsers/foodParser';
import { takeOrder } from '../../functions/takeOrder';
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual('Julie Mirage has budget: 100 -> wants to order Fish In Water, which cost: 49.40: success');
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Elon Carousel has budget: 50 -> wants to order Fish In Water -> can't order, alergic to: vinegar`);
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Julie Mirage has budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 369.2`);
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Bernard Unfortunate has budget: 15 -> wants to order Emperor Chicken -> can't order, food cost 369.2, alergic to: potatoes`);
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Sorry we can't handle your request Jaques Chirac, we don't know about your alergies.`);
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

        //when
        const result = takeOrder(input, customers, food, baseIngredients, restaurant);
        //then
        expect(result).toEqual(`Sorry we don't serve: Pretzels`);
    });
});
