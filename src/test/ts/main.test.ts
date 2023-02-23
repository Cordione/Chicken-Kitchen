import { main } from '../../functions';

describe('Take order tests', () => {
    test('Multiple orders at once.', () => {
        //given
        //when
        const result = main('Buy', 'Adam Smith', 'Princess Chicken', 'Buy', 'Adam Smith', 'Princess Chicken', 'Buy', 'Julie Mirage', 'Emperor Chicken', 'Buy', 'Alexandra Smith', 'Emperor Chicken');
        //then
        expect(result).toEqual([
            'Adam Smith have budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Adam Smith have budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Julie Mirage have budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 369.2',
            'Alexandra Smith have budget: 500 -> wants to order Emperor Chicken, which cost: 369.20: success',
        ]);
    });
    test('Should work properly with multi operations.', () => {
        //given
        //when
        const result = main(
            'Buy',
            'Adam Smith',
            'Princess Chicken',
            'Buy',
            'Alexandra Smith',
            'Emperor Chicken',
            'budget',
            '+',
            '1200',
            'Order',
            'Tuna',
            '100',
            'Buy',
            'Adam Smith',
            'Princess Chicken',
            'Buy',
            'Julie Mirage',
            'Emperor Chicken'
        );
        //then
        expect(result).toEqual([
            'Adam Smith have budget: 100 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 117',
            'Alexandra Smith have budget: 500 -> wants to order Emperor Chicken, which cost: 369.20: success',
            'Budget of restaurant was increased by: 1200, new budget is: 2069.20',
            'We ordered 100x Tuna and current restaurant budget is -430.80',
            'RESTAURANT BANKRUPT',
            'RESTAURANT BANKRUPT',
        ]);
    });
    test('Restaurant should NOT accept new orders after reporting bankrupcy, insteed should write "RESTAURANT BANKRUPT".', () => {
        //given
        //when
        const result = main('order', 'tuna', '25', 'Buy', 'Julie Mirage', 'Emperor Chicken', 'Buy', 'Alexandra Smith', 'Emperor Chicken');
        //then
        expect(result).toEqual(['We ordered 25x tuna and current restaurant budget is -125.00', 'RESTAURANT BANKRUPT', 'RESTAURANT BANKRUPT']);
    });
});
