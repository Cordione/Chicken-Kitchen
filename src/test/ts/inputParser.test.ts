import { inputParser } from '../../functions/parsers/inputParser';

describe('Input tests', () => {
    test('Should properly display eglible records', () => {
        //given
        const filePath = './src/test/txt/input.txt';
        //when
        const result = inputParser(filePath);
        //then
        expect(result).toEqual([
            ['Buy', 'Julie Mirage', 'Princess Chicken'],
            ['Buy', 'Elon Carousel', 'Tuna Cake'],
            ['Buy', 'Adam Smith', 'Fries'],
        ]);
    });
});
