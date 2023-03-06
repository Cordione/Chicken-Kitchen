import { main } from '../../functions';

describe('Take order tests', () => {
    // test('Multiple orders at once.', () => {
    //     //given
    //     const inputString: string = 'Buy, Adam Smith, Princess Chicken\nBuy, Adam Smith, Princess Chicken\nBuy, Julie Mirage, Emperor Chicken\nbuy, alexandra smith, emperor chicken';
    //     //when
    //     const result = main(inputString);
    //     //then
    //     expect(result).toEqual([
    //         'Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
    //         'Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
    //         'Julie Mirage has budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 369.2',
    //         'Alexandra Smith has budget: 500 -> wants to order Emperor Chicken, which cost: 369.20: success',
    //     ]);
    // });
    // test('Should work properly with multi operations.', () => {
    //     //given
    //     const inputString: string =
    //         'bUy, aDaM Smith, prinCESS Chicken\nbuy, alexandra smith, emperor chicken\nbudget, +, 1200\norder, tuna, 100\nbuy, adam smith, princess chicken\nbuy, julie Mirage, emperor chicken';
    //     //when
    //     const result = main(inputString);
    //     //then
    //     expect(result).toEqual([
    //         'Adam Smith has budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
    //         'Alexandra Smith has budget: 500 -> wants to order Emperor Chicken, which cost: 369.20: success',
    //         'Budget of restaurant was increased by: 1200, new budget is: 2069.20',
    //         'We ordered 100x tuna and current restaurant budget is -430.80',
    //         'RESTAURANT BANKRUPT',
    //         'RESTAURANT BANKRUPT',
    //     ]);
    // });
    test('Restaurant should NOT accept new orders after reporting bankrupcy, insteed should write "RESTAURANT BANKRUPT".', () => {
        //given
        const inputString: string = 'order, tuna, 25\nbuy, julie mirage, emperor chicken\nbuy, alexandra smith, emperor chicken'
        //when
        const result = main(inputString);
        //then
        expect(result).toEqual(['We ordered 25x tuna and current restaurant budget is -125.00', 'RESTAURANT BANKRUPT', 'RESTAURANT BANKRUPT']);
    });
});
