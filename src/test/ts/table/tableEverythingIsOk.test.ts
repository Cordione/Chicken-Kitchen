import { tableEverythingIsOk } from '../../../functions/outputs/table/tableEverythingIsOk';
import { baseIngredientsParser } from '../../../functions/parsers/baseIngredientsParser';
import { warehouseParser } from '../../../functions/parsers/warehouseParser';
import { commandJSONFileOutput } from '../../../functions/utils/commandJSONFileOutput';
import { ICustomerAlergies } from '../../../Interface/ICustomerAlergies';
import { IMaterials } from '../../../Interface/IMaterials';
import { IRestaurant } from '../../../Interface/IRestaurant';
import { ISpecificOrder } from '../../../Interface/ISpecificOrder';

describe('Table, EverythingIsOkTests', () => {
    test('2 customers, one will tip, second will not', () => {
        //given
        const customers: ICustomerAlergies[] = [
            { customerName: 'Adam Smith', alergies: [], budget: 150, sucessfulAppearances: 0 },
            { customerName: 'Jacques Chirac', alergies: [], budget: 150, sucessfulAppearances: 0 },
        ];
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 2 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const informationAboutOrdersAndItsPrice: ISpecificOrder[] = [
            { name: 'fries', price: 100 },
            { name: 'fries', price: 100 },
        ];
        const restaurantMarkup: number = 1.3;
        const transactionTax: number = 0.1;
        const informationAboutMissingMaterials: IMaterials[] = [];
        const foodList: string[] = ['fries', 'fries'];
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = tableEverythingIsOk(
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
            jest.fn<number, number[]>().mockReturnValueOnce(95).mockReturnValueOnce(0.01)
        );
        const lines = result[0] as string[];
        //then
        expect(lines[2]).toContain('Adam Smith, ordered fries, cost: 132 -> success: customer decided to tip: 2, Restaurant gets: 119, transactionTax: 13.');
        expect(lines[3]).toContain('Jacques Chirac, ordered fries, cost: 130 -> success: Restaurant gets: 117, transactionTax: 13.');
    });
    test('2 customers, one will tip, second will not, reversed order', () => {
        //given
        const customers: ICustomerAlergies[] = [
            { customerName: 'Adam Smith', alergies: [], budget: 150, sucessfulAppearances: 0 },
            { customerName: 'Jacques Chirac', alergies: [], budget: 150, sucessfulAppearances: 0 },
        ];
        const informationAboutUsedMaterials: IMaterials[] = [{ name: 'potatoes', quantity: 2 }];
        const allIngredients = baseIngredientsParser('./src/csv_files/baseIngredients.csv');
        const restaurant: IRestaurant = {
            budget: 500,
        };
        const informationAboutOrdersAndItsPrice: ISpecificOrder[] = [
            { name: 'fries', price: 100 },
            { name: 'fries', price: 100 },
        ];
        const restaurantMarkup: number = 1.3;
        const transactionTax: number = 0.1;
        const informationAboutMissingMaterials: IMaterials[] = [];
        const foodList: string[] = ['fries', 'fries'];
        const jsonSource = '../../json/allEnabled.json';
        const json = commandJSONFileOutput(jsonSource);
        const warehouse = warehouseParser('./src/csv_files/warehouseSupplied.csv', allIngredients, json);
        //when
        const result = tableEverythingIsOk(
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
            jest.fn<number, number[]>().mockReturnValueOnce(5).mockReturnValueOnce(95).mockReturnValueOnce(0.01)
        );
        const lines = result[0] as string[];
        //then

        expect(lines[0]).toContain(`Adam Smith, Jacques Chirac, ordered fries, fries -> success, total cost including tips: 262, total tax: 26, total tips: 2.`);
        expect(lines[2]).toContain(`Adam Smith, ordered fries, cost: 130 -> success: Restaurant gets: 117, transactionTax: 13.`);
        expect(lines[3]).toContain('Jacques Chirac, ordered fries, cost: 132 -> success: customer decided to tip: 2, Restaurant gets: 119, transactionTax: 13.');
    });
});
