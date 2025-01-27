import { Address } from "../entity/value-objects/address"
import { CustomerFactory } from "./customer.factory"

describe("Customer Factory unit tests", () => {
    it("should be able to create a new customer through the factory", () => {
        const customer = CustomerFactory.create("Customer 1")

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Customer 1")
        expect(customer.address).toBeUndefined()
    })

    it("should be able to create a new customer with address through the factory", () => {
        const address = new Address("Street 1", 1, "12345", "City 1")
        const customer = CustomerFactory.createWithAddress("Customer 1", address)

        expect(customer.id).toBeDefined()
        expect(customer.name).toBe("Customer 1")
        expect(customer.address).toStrictEqual(address)
    })
})