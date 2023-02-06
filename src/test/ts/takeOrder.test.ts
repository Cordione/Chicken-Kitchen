import { takeOrder } from '../../functions/takeOrder';

describe('Take order tests', () => {
    test('Julie Mirage should be able to buy fish in water.', () => {
        //given
        const customer = 'Julie mirage';
        const order = 'Fish iN WaTeR';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual('Julie Mirage - Fish In Water: success');
    });
    test('Elon Carousel should not be able to buy fish in water.', () => {
        //given
        const customer = 'Elon Carousel';
        const order = 'fish in water';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual(`Elon Carousel - Fish In Water: can't order, alergic to: vinegar`);
    });
    test('Julie Mirage should not be able to buy fish in water.', () => {
        //given
        const customer = 'Julie Mirage';
        const order = 'Emperor Chicken';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual(`Julie Mirage - Emperor Chicken: success`);
    });
    test('Bernard Unfortunate should not be able to buy fish in water.', () => {
        //given
        const customer = 'Bernard Unfortunate';
        const order = 'Emperor Chicken';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual(`Bernard Unfortunate - Emperor Chicken: can't order, alergic to: potatoes`);
    });
    test('Unknown customer want to place an order', () => {
        //given
        const customer = 'Jaques Chirac';
        const order = 'Emperor Chicken';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual(`Sorry we can't handle your request Jaques Chirac, we don't know about your alergies.`);
    });
    test('Bernard Unfortunate want to order pretzles', () => {
        //given
        const customer = 'Bernard Unfortunate';
        const order = 'Pretzles';
        //when
        const result = takeOrder(customer, order);
        //then
        expect(result).toEqual(`Sorry we don't serve: Pretzles.`);
    });
});
