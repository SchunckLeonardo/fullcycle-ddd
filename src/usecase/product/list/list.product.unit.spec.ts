import { MockRepository } from "../../../../test/repository/mock-repository"
import { ProductFactory } from "../../../domain/product/factory/product.factory"
import { ListProductUseCase } from "./list.product.usecase"

describe("List product usecase unit tests", () => {
    it("should be able to list products", async () => {
        const product1 = ProductFactory.create("Product 1", 100)
        const product2 = ProductFactory.create("Product 2", 200)

        const mockRepository = MockRepository([product1, product2])

        const sut = new ListProductUseCase(mockRepository)

        const output = await sut.execute()

        const expectedOutput = {
            products: [
                {
                    id: product1.id,
                    name: product1.name,
                    price: product1.price
                },
                {
                    id: product2.id,
                    name: product2.name,
                    price: product2.price
                }
            ]
        }

        expect(output).toStrictEqual(expectedOutput)
        expect(output.products.length).toBe(2)
    })

})