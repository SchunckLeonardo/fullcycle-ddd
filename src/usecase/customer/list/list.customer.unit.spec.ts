import { Address } from "../../../domain/customer/entity/value-objects/address";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { ListCustomerUseCase } from "./list.customer.usecase";

const customer1 = CustomerFactory.createWithAddress("John Doe", new Address("Main St", 123, "12345", "Springfield"));
const customer2 = CustomerFactory.createWithAddress("Clara Doe", new Address("Street 2", 456, "12345", "New York"));

const MockRepository = () => {
    return {
        create: jest.fn(),
        getById: jest.fn(),
        fetchAll: jest.fn().mockReturnValue(Promise.resolve([customer1, customer2])),
        update: jest.fn()
    }
}

describe("List customers use case unit test", () => {
    it("should be able to list customers", async () => {
        const mockRepository = MockRepository()
        const sut = new ListCustomerUseCase(mockRepository)

        const output = {
            customers: [
                {
                    id: customer1.id,
                    name: customer1.name,
                    address: {
                        street: customer1.address.street,
                        city: customer1.address.city,
                        number: customer1.address.number,
                        zip: customer1.address.zip
                    }
                },
                {
                    id: customer2.id,
                    name: customer2.name,
                    address: {
                        street: customer2.address.street,
                        city: customer2.address.city,
                        number: customer2.address.number,
                        zip: customer2.address.zip
                    }
                }
            ]
        }

        const result = await sut.execute()

        expect(result).toStrictEqual(output)
        expect(result.customers.length).toBe(2)
    })
})