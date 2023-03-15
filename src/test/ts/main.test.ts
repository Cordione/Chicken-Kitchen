import { main } from '../../functions';
describe('Take order tests', () => {
    test('Restaurant should NOT accept new orders after reporting bankrupcy, insteed should write "RESTAURANT BANKRUPT".', () => {
        //given
        const inputString: string = 'order, tuna, 25\nbuy, julie mirage, emperor chicken\nbuy, alexandra smith, emperor chicken';
        //when
        const result = main(inputString);
        //then
        expect(result).toEqual(['We ordered 25x tuna and current restaurant budget is -188', 'RESTAURANT BANKRUPT', 'RESTAURANT BANKRUPT', 'Daily tax to pay: 0']);
    });
    test('Work with json source, all commands are enabled', () => {
        //given
        const inputString: string = 'Buy, Julie Mirage, Princess Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries';
        //when
        const jsonSource = '../../json/allEnabled.json';
        const result = main(inputString, jsonSource);
        //then
        expect(result[0]).toEqual('Julie Mirage has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117');
        expect(result[1]).toEqual(`Barbara Smith, ordered Tuna Cake -> FAILURE\n{\nWe're sorry: Barbara Smith, we cannot provide you with table, becouse you're alergic to: chocolate\n}`);
        expect(result[2]).toEqual(`Morningstar command disabled.`);
    });
    test('Work with json source, all commands are disabled', () => {
        //given
        const inputString: string = 'Buy, Julie Mirage, Princess Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries';
        //when
        const jsonSource = '../../json/commands.json';
        const result = main(inputString, jsonSource);
        //then
        expect(result[0]).toEqual('Buy command disabled.');
        expect(result[1]).toEqual(`Table Command disabled.`);
        expect(result[2]).toEqual(`Morningstar command disabled.`);
    });
    test('Testing budget', () => {
        //given
        const inputString: string = 'budget, -, 501\n budget, +, 0\nbudget, +, 1';
        //when
        const jsonSource = '../../json/allEnabled.json';
        const result = main(inputString, jsonSource);
        //then
        expect(result[0]).toEqual('Budget of restaurant was reduced by: 501, new budget is: -1');
        expect(result[1]).toEqual(`RESTAURANT BANKRUPT`);
        expect(result[2]).toEqual(`Budget of restaurant was increased by: 1, new budget is: 0`);
    });
});
