import { takeOrder } from "./takeOrder";

function main(specificCustomer: string, order: string) {
    const result = takeOrder("John Doe", "Fries")
    return result
}
