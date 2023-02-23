import { createReport } from '../../functions/createReport';

describe('Create report tests', () => {
    test('Should properly return base ingredients', () => {
        //given
        const restaurantBudgetIterations: number[] = [500, 617 ];
        const orders: string[] = [
            'Alexandra Smith have budget: 500 -> wants to order Princess Chicken, which cost: 117.00: success',
        ];
        //when
        const report = createReport(restaurantBudgetIterations, orders);
        //then
        expect(report[0]).toEqual("Restaurant budget: 500");
        expect(report[1]).toEqual("Alexandra Smith have budget: 500 -> wants to order Princess Chicken, which cost: 117.00: success");
        expect(report[2]).toEqual("Restaurant budget: 617");
    });
});
