import { baseIngredientsParser } from '../../functions/parsers/baseIngredientsParser';
import { commandTokenizer } from '../../functions/parsers/commandTokenizer';
import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';

describe('Command Tokenizer tests', () => {
    test('Should properly display records', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(
            `Buy, Julie Mirage, Princess Chicken \n\r Buy, Elon Carousel, Tuna Cake \n\r Sadkl,jaslkdjasldkjaskldjsa\n\r buy, Julie Mirage,\n\r order, tuna, 5\n\r budget, +, 10\n\r Audit, Resources`,
            baseIngredients
        );
        //when
        //then
        expect(commandAndParameters).toEqual([
            { command: 'Buy', flag: '', parameters: ['Julie Mirage', 'Princess Chicken'] },
            { command: 'Buy', flag: '', parameters: ['Elon Carousel', 'Tuna Cake'] },
            { command: 'order', flag: '', parameters: ['tuna', '5'] },
            { command: 'budget', flag: '', parameters: ['+', '10'] },
            { command: 'Audit', flag: '', parameters: ['Resources'] },
        ]);
    });

    test('Should properly handle output for table (single person/single order)', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(`table, Julie Mirage, Princess Chicken`, baseIngredients);
        //when
        //then
        expect(commandAndParameters).toEqual([{ command: 'table', flag: '', parameters: ['Julie Mirage', 'Princess Chicken'] }]);
    });
    test('Should properly handle output for table (2 persons/2 orders, affordable, w/o alergies)', () => {
        //given
        const baseIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const commandAndParameters: ICommandAndParameters[] = commandTokenizer(`Table, Alexandra Smith, Adam Smith, Irish Fish, Fries`, baseIngredients);
        //when
        //then
        expect(commandAndParameters).toEqual([{ command: 'Table', flag: '', parameters: ['Alexandra Smith', 'Adam Smith', 'Irish Fish', 'Fries'] }]);
    });
});
