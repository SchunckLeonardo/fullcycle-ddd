import { MockRepository } from "../../../../test/repository/mock-repository"
import { ProductFactory } from "../../../domain/product/factory/product.factory"
import { FindProductUseCase } from "./find.product.usecase"

describe("Find product use case unit test", () => {
    it("should be able to find a product", async () => {
        const inputCreate = {
            name: "Product 1",
            price: 100
        }

        const product = ProductFactory.create(inputCreate.name, inputCreate.price)

        const productRepository = MockRepository(product)
        const sut = new FindProductUseCase(productRepository)

        const input = {
            id: product.id
        }

        const outputExpected = {
            id: product.id,
            name: product.name,
            price: product.price
        }

        const output = await sut.execute(input)

        expect(output).toStrictEqual(outputExpected)
    })
})