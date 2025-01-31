import { Sequelize } from "sequelize-typescript"
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/model/customer.model"
import { CustomerRepository } from "../../../infrastructure/customer/repository/customer.repository"
import { Customer } from "../../../domain/customer/entity/customer"
import { Address } from "../../../domain/customer/entity/value-objects/address"
import { CreateCustomerUseCase } from "./create.customer.usecase"
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto"

describe("Create customer use case integration test", () => {
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
        const sut = new CreateCustomerUseCase(customerRepository)

        const input: InputCreateCustomerDto = {
            name: "John Doe",
            address: {
                street: "Main Street",
                city: "New York",
                number: 123,
                zip: "12345"
            }
        }

        const output: OutputCreateCustomerDto = {
            id: expect.any(String),
            name: "John Doe",
            address: {
                street: "Main Street",
                city: "New York",
                number: 123,
                zip: "12345"
            }
        }

        const createCustomerUseCaseResponse = await sut.execute(input)

        const customerFound = await customerRepository.getById(createCustomerUseCaseResponse.id)

        expect(customerFound.name).toBe(createCustomerUseCaseResponse.name)
        expect(customerFound.address.street).toBe(createCustomerUseCaseResponse.address.street)
        expect(createCustomerUseCaseResponse).toStrictEqual(output)
    })
})