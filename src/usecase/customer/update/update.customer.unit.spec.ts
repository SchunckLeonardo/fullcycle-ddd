import { Address } from "../../../domain/customer/entity/value-objects/address"
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory"
import { UpdateCustomerUseCase } from "./update.customer.usecase"

const customer = CustomerFactory.createWithAddress('John Doe', new Address('Main St', 123, '12345', 'New York'))

const input = {
    id: customer.id,
    name: "John Updated",
    address: {
        street: "Street Updated",
        city: "City Updated",
        number: 567,
        zip: "Zip Updated"
    }
}

const MockRepository = () => {
    return {
        update: jest.fn(),
        create: jest.fn(),
        getById: jest.fn().mockReturnValue(Promise.resolve(customer)),
        fetchAll: jest.fn()
    }
}

describe("Update Customer usecase unit test", () => {
    it("should be able to update a customer", async () => {
        const mockRepository = MockRepository()
        const sut = new UpdateCustomerUseCase(mockRepository)

        const result = await sut.execute(input)

        const outputExpected = {
            id: customer.id,
            name: input.name,
            address: {
                street: input.address.street,
                city: input.address.city,
                number: input.address.number,
                zip: input.address.zip
            }
        }

        expect(result).toEqual(outputExpected)
    })
})