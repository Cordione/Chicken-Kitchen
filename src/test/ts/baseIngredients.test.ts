import { baseIngredientsParser } from "../../functions/parsers/baseIngredientsParser";

describe('Base ingredients tests', () => {
    test('Should properly return base ingredients', () => {
        //given
        const filePath = './src/test/csv/baseIngredients.csv';
        //when
        const result = baseIngredientsParser(filePath);
        //then
        expect(result[0].name).toEqual('Chicken');
        expect(result[1].name).toEqual('Tuna');
        expect(result[2].name).toEqual('Potatoes');
    });
});
