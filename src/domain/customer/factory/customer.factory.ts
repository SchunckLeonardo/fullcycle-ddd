import { v4 as uuid } from "uuid"
import { Customer } from "../entity/customer"
import { Address } from "../entity/value-objects/address"

export class CustomerFactory {
    public static create(name: string) {
        return new Customer(uuid(), name)
    }

    public static createWithAddress(name: string, address: Address) {
        const customer = this.create(name)
        customer.changeAddress(address)
        return customer
    }
}