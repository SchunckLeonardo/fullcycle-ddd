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
        customer.changeAddress(address)
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

    it("should be able to add reward points", () => {
        const customer = new Customer("123", "John Doe")
        expect(customer.rewardPoints).toBe(0)

        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(10)
        
        customer.addRewardPoints(10)
        expect(customer.rewardPoints).toBe(20)
    })

    it("should be able to throw an error if try to add negative number on reward points", () => {
        const customer = new Customer("123", "John Doe")
        expect(() => customer.addRewardPoints(-10)).toThrow("Points must be a positive number")
    })
})