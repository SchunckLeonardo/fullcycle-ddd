import { MockRepository } from "../../../../test/repository/mock-repository"
import { ProductFactory } from "../../../domain/product/factory/product.factory"
import { UpdateProductUseCase } from "./update.product.usecase"

describe("Update product usecase unit tests", () => {

    const product = ProductFactory.create("Product 1", 100)
    const mockRepository = MockRepository(product)

    it("should be able to update a product", async () => {

        const input = {
            id: product.id,
            name: "Product 2",
            price: 500
        }

        const sut = new UpdateProductUseCase(mockRepository)

        const output = await sut.execute(input)

        const expectedOutput = {
            id: product.id,
            name: input.name,
            price: input.price
        }

        expect(output).toStrictEqual(expectedOutput)
        expect(output.name).toBe(input.name)
        expect(output.price).toBe(input.price)
    })

})