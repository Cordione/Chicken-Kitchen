import { main } from '../../functions';
import * as com from '../../json/allEnabled.json';
describe('Take order tests', () => {
    test('Restaurant should NOT accept new orders after reporting bankrupcy, insteed should write "RESTAURANT BANKRUPT".', () => {
        //given
        const inputString: string = 'order, tuna, 25\nbuy, julie mirage, emperor chicken\nbuy, alexandra smith, emperor chicken';
        //when
        const result = main(inputString);
        //then
        expect(result).toEqual(['We ordered 25x tuna and current restaurant budget is -125.00', 'RESTAURANT BANKRUPT', 'RESTAURANT BANKRUPT']);
    });
    test('Work with json source', () => {
        //given
        const inputString: string = 'Buy, Julie Mirage, Princess Chicken\n Table, Barbara Smith, Tuna Cake\n Morningstar, Alexandra Smith, Adam Smith, Irish Fish, Fries';
        //when
        // const jsonSource = '../../json/commands.json'
        const jsonSource = '../../json/allEnabled.json';
        const result = main(inputString, jsonSource);
        //then
        // expect(result[0]).toEqual('Julie Mirage has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117');
        expect(result[1]).toEqual(`Barbara Smith, ordered Tuna Cake -> FAILURE\n{\nWe're sorry: Barbara Smith, we cannot provide you with table, becouse you're alergic to: chocolate\n}`);
        expect(result[2]).toEqual(`Morningstar command disabled.`);
    });
});
