import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { commandTokenizer } from '../../functions/parsers/commandTokenizer';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';

describe('Command Tokenizer tests', () => {
    test('Should properly display records', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(
            `Buy, Julie Mirage, Princess Chicken \n\r Buy, Elon Carousel, Tuna Cake \n\r Sadkl,jaslkdjasldkjaskldjsa\n\r buy, Julie Mirage,\n\r order, tuna, 5\n\r budget, +, 10`,
            baseIngredients
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

    test('Should properly handle output for table (single person/single order)', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(`table, Julie Mirage, Princess Chicken`, baseIngredients);
        //when
        //then
        expect(commandAndParameters).toEqual([{ command: 'table', parameters: ['Julie Mirage', 'Princess Chicken'] }]);
    });
    test('Should properly handle output for table (2 persons/2 orders, affordable, w/o alergies)', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(`Table, Alexandra Smith, Adam Smith, Irish Fish, Fries`, baseIngredients);
        //when
        //then
        expect(commandAndParameters).toEqual([{ command: 'Table', parameters: ['Alexandra Smith', 'Adam Smith', 'Irish Fish', 'Fries'] }]);
    });
});
