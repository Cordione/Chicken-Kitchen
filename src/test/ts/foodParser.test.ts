import { foodParser } from '../../functions/parsers/foodParser';

describe('Food tests', () => {
    test('Should properly display food and ingredients', () => {
        //given
        const filePath = './src/test/csv/food.csv';
        //when
        const result = foodParser(filePath);
        //then
        expect(result[0].name).toEqual('Emperor Chicken');
        expect(result[0].ingerdients).toEqual(['Fat Cat Chicken', 'Spicy Sauce', 'Tuna Cake']);
    });
});
