import { CreateCustomerUseCase } from "./create.customer.usecase"

const MockRepository = () => {
    return {
        getById: jest.fn(),
        fetchAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    }
}

describe("Create customer use case unit test", () => {
    
    it("should be able to create a customer", async () => {
        const mockRepository = MockRepository()
        const sut = new CreateCustomerUseCase(mockRepository)

        const input = {
            name: "John Doe",
            address: {
                street: "Main Street",
                city: "New York",
                zip: "123456",
                number: 123
            }
        }

        const output = {
            id: expect.any(String),
            ...input
        }
        
        const response = await sut.execute(input)

        expect(response).toStrictEqual(output)
    })

    it("should be able to throw an error when creating a customer with name is missing", async () => {
        const mockRepository = MockRepository()
        mockRepository.create = jest.fn().mockImplementation(() => {
            throw new Error("Name is required")
        })
        const sut = new CreateCustomerUseCase(mockRepository)

        const input = {
            name: "",
            address: {
                street: "Main Street",
                city: "New York",
                zip: "123456",
                number: 123
            }
        }

        await expect(sut.execute(input)).rejects.toThrow("Name is required")
    })

    it("should be able to throw an error when creating a customer with address is missing", async () => {
        const mockRepository = MockRepository()
        mockRepository.create = jest.fn().mockImplementation(() => {
            throw new Error("Street is required")
        })
        const sut = new CreateCustomerUseCase(mockRepository)

        const input = {
            name: "John Doe",
            address: {
                street: "",
                city: "New York",
                zip: "123456",
                number: 123
            }
        }

        await expect(sut.execute(input)).rejects.toThrow("Street is required")
    })
})