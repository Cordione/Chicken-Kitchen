import { customersParser } from "../../functions/parsers/customersParser"

describe("Customer alergies tests", ()=>{
    test('Should properly display alergies of customers', ()=>{
        //given
        const filePath = './src/test/csv/customersAlergies.csv'
        //when
        const result = customersParser(filePath)
        //then
        expect(result[0].customerName).toEqual("Julie Mirage")
        expect(result[0].alergies).toContain("Soy")
    })
})