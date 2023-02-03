import { customerAlergies } from "../../functions/parsers/customer_alergies_parser"

describe("Customer alergies tests", ()=>{
    test('Should properly display alergies of customers', ()=>{
        //given
        const filePath = './src/test/csv/customer_alergies.csv'
        //when
        const result = customerAlergies(filePath)
        //then
        expect(result[0].customerName).toEqual("Julie Mirage")
        expect(result[0].alergies).toContain("Soy")
    })
})