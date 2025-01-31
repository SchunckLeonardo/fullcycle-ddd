import { Sequelize } from "sequelize-typescript"
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/model/customer.model"
import { CustomerRepository } from "../../../infrastructure/customer/repository/customer.repository"
import { Customer } from "../../../domain/customer/entity/customer"
import { Address } from "../../../domain/customer/entity/value-objects/address"
import { InputFindCustomerDto, OutputFindCustomerDto } from "./find.customer.dto"
import { FindCustomerUseCase } from "./find.customer.usecase"

describe("Find customer use case integration test", () => {
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

    it("should be able to find a customer", async () => {
        const customerRepository = new CustomerRepository()
        const sut = new FindCustomerUseCase(customerRepository)

        const address = new Address("Main Street", 123, "12345", "New York")
        const customer = new Customer("1", "John Doe")
        customer.changeAddress(address)

        await customerRepository.create(customer)

        const input: InputFindCustomerDto = {
            id: "1"
        }

        const output: OutputFindCustomerDto = {
            id: "1",
            name: "John Doe",
            address: {
                street: "Main Street",
                city: "New York",
                number: 123,
                zip: "12345"
            }
        }

        const findCustomerUseCase = await sut.execute(input)

        expect(findCustomerUseCase).toStrictEqual(output)
    })

    it("should be able to throw an error if not find a customer", async () => {
        const customerRepository = new CustomerRepository()
        const sut = new FindCustomerUseCase(customerRepository)

        const input: InputFindCustomerDto = {
            id: "123"
        }

        await expect(() => sut.execute(input)).rejects.toThrow("Customer not found")
    })
})