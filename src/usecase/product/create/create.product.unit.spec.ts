import { MockRepository } from "../../../../test/repository/mock-repository"
import { ProductFactory } from "../../../domain/product/factory/product.factory"
import { CreateProductUseCase } from "./create.product.usecase"

describe("Create product usecase unit tests", () => {

    const mockRepository = MockRepository()

    it("should be able to create a product", async () => {
        const input = {
            name: "Product 1",
            price: 100
        }

        const sut = new CreateProductUseCase(mockRepository)

        const output = await sut.execute(input)

        const expectedOutput = {
            id: expect.any(String),
            name: input.name,
            price: input.price
        }

        expect(output).toStrictEqual(expectedOutput)
    })

})