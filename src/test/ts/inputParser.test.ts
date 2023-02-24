import { inputParser } from '../../functions/parsers/inputParser';

describe('Input tests', () => {
    test('Should properly display eglible records', () => {
        //given
        const filePath = './src/test/txt/input.txt';
        //when
        const result = inputParser(filePath);
        //then
        expect(result).toEqual([
            { command: 'Buy', parameters: ['Julie Mirage', 'Princess Chicken'] },
            { command: 'Buy', parameters: ['Elon Carousel', 'Tuna Cake'] },
            { command: 'Buy', parameters: ['Adam Smith', 'Fries'] },
        ]);
    });
});
