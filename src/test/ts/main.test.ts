import { main } from '../../functions';

describe('Take order tests', () => {
    test('Multiple orders at once.', () => {
        //given
        //when
        const result = main('Adam Smith', 'Princess Chicken', 'Adam Smith', 'Princess Chicken', 'Julie Mirage', 'Emperor Chicken', 'Alexandra Smith', 'Emperor Chicken');
        //then
        expect(result).toEqual([
            'Adam Smith - Princess Chicken: success',
            'Adam Smith – can’t order, budget 10 and Princess Chicken costs 90',
            'Julie Mirage – can’t order, budget 100 and Emperor Chicken costs 284',
            'Alexandra Smith - Emperor Chicken: success',
        ]);
    });
});
