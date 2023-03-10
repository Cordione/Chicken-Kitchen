import { ICommandAndParameters } from '../../Interface/ICommandAndParameters';
import { ICustomerAlergies } from '../../Interface/ICustomerAlergies';

export function listOfCustomers(commandAndParameters: ICommandAndParameters, customerList: ICustomerAlergies[]) {
    const customers: ICustomerAlergies[] = [];
    if (commandAndParameters.parameters != undefined) {
        for (let index = 0; index < commandAndParameters.parameters.length; index++) {
            const specific = commandAndParameters.parameters[index];
            const specificCustomer = customerList.find(customer => customer.customerName.toLowerCase() === specific.toLowerCase());
            if (specificCustomer != undefined) {
                customers.push(specificCustomer);
            }
        }
    }
    return customers;
}
