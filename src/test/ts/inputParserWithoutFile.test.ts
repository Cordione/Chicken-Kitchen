import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { inputParserWithoutFile } from '../../functions/parsers/inputParserWithoutFile';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';

describe('Input parser without file tests', () => {
    test('Should properly display records', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = inputParserWithoutFile(
            `Buy, Julie Mirage, Princess Chicken \n\r Buy, Elon Carousel, Tuna Cake \n\r Sadkl,jaslkdjasldkjaskldjsa\n\r buy, Julie Mirage,\n\r order, tuna, 5\n\r budget, +, 10`,
            baseIngredientsParser('./src/csv_files/baseIngredients.csv')
        );
        //when
        //then
        expect(commandAndParameters).toEqual([
            { command: 'Buy', parameters: ['Julie Mirage', 'Princess Chicken'] },
            { command: 'Buy', parameters: ['Elon Carousel', 'Tuna Cake'] },
            { command: 'order', parameters: ['tuna', '5'] },
            { command: 'budget', parameters: ['+', '10'] },
        ]);
    });
});
