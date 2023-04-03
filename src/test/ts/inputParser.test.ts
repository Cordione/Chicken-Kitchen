import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { inputParser } from '../../functions/parsers/inputParser';

describe('Input tests', () => {
    test('Should properly display eglible records', () => {
        //given
        const filePath = './src/test/txt/input.txt';
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        //when
        const result = inputParser(filePath, baseIngredients);
        //then
        expect(result).toEqual([
            { command: 'Buy', flag: '', parameters: ['Julie Mirage', 'Princess Chicken'] },
            { command: 'Buy', flag: '', parameters: ['Elon Carousel', 'Tuna Cake'] },
            { command: 'Sadkl', flag: '', parameters: [] },
            { command: 'Buy', flag: '', parameters: ['Adam Smith', 'Fries'] },
            { command: 'Audit', flag: '', parameters: ['Resources'] },
        ]);
    });
});
