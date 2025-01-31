import { Sequelize } from "sequelize-typescript"
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/model/customer.model"
import { CustomerRepository } from "../../../infrastructure/customer/repository/customer.repository"
import { Customer } from "../../../domain/customer/entity/customer"
import { Address } from "../../../domain/customer/entity/value-objects/address"
import { InputFindCustomerDto, OutputFindCustomerDto } from "./find.customer.dto"
import { FindCustomerUseCase } from "./find.customer.usecase"

const address = new Address("Main Street", 123, "12345", "New York")
const customer = new Customer("1", "John Doe")
customer.changeAddress(address)

const MockRepository = () => {
    return {
        getById: jest.fn().mockReturnValue(Promise.resolve(customer)),
        fetchAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Find customer use case unit test", () => {
    it("should be able to find a customer", async () => {
        const customerRepository = MockRepository()
        const sut = new FindCustomerUseCase(customerRepository)

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
        const customerRepository = MockRepository()
        customerRepository.getById.mockImplementation(() => {
            throw new Error("Customer not found")
        })
        const sut = new FindCustomerUseCase(customerRepository)

        const input: InputFindCustomerDto = {
            id: "123"
        }

        await expect(() => sut.execute(input)).rejects.toThrow("Customer not found")
    })
})