import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { IMaterials } from '../../../Interface/IMaterials';
import { IRestaurant } from '../../../Interface/IRestaurant';
import { ISpecificOrder } from '../../../Interface/ISpecificOrder';
import { tableEverythingIsOkPooled } from '../../../functions/outputs/table/tableEverythingIsOkPooled';
import { baseIngredientsParser } from '../../../functions/parsers/baseIngredientsParser';
import { warehouseParser } from '../../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../../functions/utils/commandJSONFileOutput';

describe('Table, EverythingIsOkPooled tests.', () => {
    test('3 customers, pooled table, will tip', () => {
        //given
        const customers: ICustomerAlergies[] = [
            { customerName: 'Julie Mirage', alergies: [], budget: 100, sucessfulAppearances: 0 },
            { customerName: 'Alexandra Smith', alergies: [], budget: 3000, sucessfulAppearances: 0 },
            { customerName: 'Bernard Unfortunate', alergies: [], budget: 15, sucessfulAppearances: 0 },
        ];
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 3 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const informationAboutOrdersAndItsPrice: ISpecificOrder[] = [
            { name: 'Emperor Chicken', price: 500 },
            { name: 'Emperor Chicken', price: 500 },
            { name: 'Emperor Chicken', price: 500 },
        ];
        const restaurantMarkup: number = 1.4;
        const transactionTax: number = 0.1;
        const informationAboutMissingMaterials: IMaterials[] = [];
        const foodList: string[] = ['Emperor Chicken', 'Emperor Chicken', 'Emperor Chicken'];
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        const budgetsOfEachCustomers: number[] = [];
        customers.forEach(el => budgetsOfEachCustomers.push(el.budget));
        //when
        const result = tableEverythingIsOkPooled(
            customers,
            informationAboutUsedMaterials,
            warehouse,
            informationAboutOrdersAndItsPrice,
            restaurantMarkup,
            transactionTax,
            informationAboutMissingMaterials,
            foodList,
            json,
            restaurant,
            budgetsOfEachCustomers,
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.1)
        );
        const lines = result[0] as string[]
        //then
        expect(lines[0]).toContain(
            'Julie Mirage, Alexandra Smith, Bernard Unfortunate, ordered Emperor Chicken, Emperor Chicken, Emperor Chicken -> success, total cost including tips: 2310, total tax: 210, total tips: 210.'
        );
        expect(lines[2]).toContain('Julie Mirage, ordered Emperor Chicken, spent: 100, table was pooled -> success: Restaurant gets: 100.');
        expect(lines[3]).toContain('Alexandra Smith, ordered Emperor Chicken, spent: 2195, table was pooled -> success: customer decided to tip: 210 Restaurant gets: 2195.');
        expect(lines[4]).toContain('Bernard Unfortunate, ordered Emperor Chicken, spent: 15, table was pooled -> success: Restaurant gets: 15.');
    });
    test('3 customers all have money for their part, pooled table, will tip', () => {
        //given
        const customers: ICustomerAlergies[] = [
            { customerName: 'Julie Mirage', alergies: [], budget: 1000, sucessfulAppearances: 0 },
            { customerName: 'Alexandra Smith', alergies: [], budget: 3000, sucessfulAppearances: 0 },
            { customerName: 'Bernard Unfortunate', alergies: [], budget: 1500, sucessfulAppearances: 0 },
        ];
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 3 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const informationAboutOrdersAndItsPrice: ISpecificOrder[] = [
            { name: 'Emperor Chicken', price: 500 },
            { name: 'Emperor Chicken', price: 500 },
            { name: 'Emperor Chicken', price: 500 },
        ];
        const restaurantMarkup: number = 1.4;
        const transactionTax: number = 0.1;
        const informationAboutMissingMaterials: IMaterials[] = [];
        const foodList: string[] = ['Emperor Chicken', 'Emperor Chicken', 'Emperor Chicken'];
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        const budgetsOfEachCustomers: number[] = [];
        customers.forEach(el => budgetsOfEachCustomers.push(el.budget));
        //when
        const result = tableEverythingIsOkPooled(
            customers,
            informationAboutUsedMaterials,
            warehouse,
            informationAboutOrdersAndItsPrice,
            restaurantMarkup,
            transactionTax,
            informationAboutMissingMaterials,
            foodList,
            json,
            restaurant,
            budgetsOfEachCustomers,
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.1)
        );
        const lines = result[0] as string[]
        //then
        expect(lines[0]).toContain('Julie Mirage, Alexandra Smith, Bernard Unfortunate, ordered Emperor Chicken, Emperor Chicken, Emperor Chicken -> success, total cost including tips: 2310, total tax: 210, total tips: 210.');
        expect(lines[2]).toContain('Julie Mirage, ordered Emperor Chicken, spent: 770, table was pooled -> success: customer decided to tip: 70 Restaurant gets: 770');
        expect(lines[3]).toContain('Alexandra Smith, ordered Emperor Chicken, spent: 770, table was pooled -> success: customer decided to tip: 70 Restaurant gets: 770.');
        expect(lines[4]).toContain('Bernard Unfortunate, ordered Emperor Chicken, spent: 770, table was pooled -> success: customer decided to tip: 70 Restaurant gets: 770.');
    });
});
