import { main } from '../../functions';

describe('Take order tests', () => {
    test('Multiple orders at once.', () => {
        //given
        //when
        const result = main('Buy', 'Adam Smith', 'Princess Chicken', 'Buy', 'Adam Smith', 'Princess Chicken', 'Buy', 'Julie Mirage', 'Emperor Chicken', 'Buy', 'Alexandra Smith', 'Emperor Chicken');
        //then
        expect(result).toEqual([
            'Adam Smith have budget: 100 -> wants to order Princess Chicken, which cost: 90: success',
            'Adam Smith have budget: 10 -> wants to order Princess Chicken -> can’t order, Princess Chicken costs 90',
            'Julie Mirage have budget: 100 -> wants to order Emperor Chicken -> can’t order, Emperor Chicken costs 284',
            'Alexandra Smith have budget: 500 -> wants to order Emperor Chicken, which cost: 284: success',
        ]);
    });
});
