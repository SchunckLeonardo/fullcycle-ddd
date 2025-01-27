import { Sequelize } from "sequelize-typescript"
import { CustomerModel } from "../db/sequelize/model/customer.model"
import { Customer } from "../../domain/entity/customer"
import { CustomerRepository } from "./customer.repository"
import { Address } from "../../domain/entity/value-objects/address"

describe("Customer Repository unit tests", () => {
    let sequelize: Sequelize

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    afterAll(async () => {
        await sequelize.close()
    })

    afterEach(async () => {
        await CustomerModel.destroy({ truncate: true })
    })
    
    it("should be able to create a customer", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address("Street 1", 1, "12345", "City 1")
        const customer = new Customer("1", "Customer 1")

        customer.changeAddress(address)

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipcode: customer.address.zip,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })
    })

    it("should be able to update a customer", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address("Street 1", 1, "12345", "City 1")
        const customer = new Customer("1", "Customer 1")

        customer.changeAddress(address)

        await customerRepository.create(customer)

        customer.changeName("Customer 2")
        customer.addRewardPoints(10)

        await customerRepository.update(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" } })

        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: customer.address.street,
            number: customer.address.number,
            zipcode: customer.address.zip,
            city: customer.address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints,
        })
    })

    it("should be able to find a customer by id", async () => {
        const customerRepository = new CustomerRepository()
        const address = new Address("Street 1", 1, "12345", "City 1")
        const customer = new Customer("1", "Customer 1")

        customer.changeAddress(address)

        await customerRepository.create(customer)

        const customerModel = await CustomerModel.findOne({ where: { id: "1" }})
        const customerFound = await customerRepository.getById("1")

        expect(customerModel.toJSON()).toStrictEqual({
            id: customerFound.id,
            name: customerFound.name,
            street: customerFound.address.street,
            number: customerFound.address.number,
            zipcode: customerFound.address.zip,
            city: customerFound.address.city,
            active: customerFound.isActive(),
            rewardPoints: customerFound.rewardPoints,
        })
    })

    it("should be able to throw an error if try to find a customer that does not exist", async () => {
        const customerRepository = new CustomerRepository()

        await expect(customerRepository.getById("1")).rejects.toThrow("Customer not found")
    })

    it("should be able to fetch all customers", async () => {
        const customerRepository = new CustomerRepository()
        const address1 = new Address("Street 1", 1, "12345", "City 1")
        const address2 = new Address("Street 2", 2, "54321", "City 2")
        const customer1 = new Customer("1", "Customer 1")
        const customer2 = new Customer("2", "Customer 2")

        customer1.changeAddress(address1)
        customer2.changeAddress(address2)

        await customerRepository.create(customer1)
        await customerRepository.create(customer2)

        const customersFound = await customerRepository.fetchAll()

        expect(customersFound).toHaveLength(2)
        expect(customersFound[0].id).toBe("1")
        expect(customersFound[1].id).toBe("2")
    })
})