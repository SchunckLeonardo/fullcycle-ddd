import { Customer } from "./customer"
import { Address } from "./value-objects/address"

describe("Customer unit tests", () => {
    it("should be able to throw an error when Id is empty", () => {
        expect(() => new Customer("", "John Doe")).toThrow("ID is required")
    })

    it("should be able to throw an error when name is empty", () => {
        expect(() => new Customer("123", "")).toThrow("Name is required")
    })

    it("should be able to change the name", () => {
        const customer = new Customer("123", "John Doe")
        customer.changeName("Jane Doe")

        expect(customer.name).toBe("Jane Doe")
    })

    it("should be able to activate a customer", () => {
        const customer = new Customer("123", "John Doe")
        const address = new Address("Main St", 123, "12345", "Springfield")
        customer.address = address
        customer.activate()

        expect(customer.isActive()).toBeTruthy()
    })

    it("should be able to deactivate a customer", () => {
        const customer = new Customer("123", "John Doe")
        customer.deactivate()

        expect(customer.isActive()).toBeFalsy()
    })

    it("should be able to throw an error when activate a customer without address", () => {
        const customer = new Customer("123", "John Doe")

        expect(() => customer.activate()).toThrow("Address is mandatory")
    })
})