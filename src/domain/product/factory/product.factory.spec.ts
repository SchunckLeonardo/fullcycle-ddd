import { ProductFactory } from "./product.factory"

describe("Product Factory unit tests", () => {
    it("should be able to create a product through the factory", () => {
        const product = ProductFactory.create("Product 1", 10)

        expect(product.id).toBeDefined()
        expect(product.name).toBe("Product 1")
        expect(product.price).toBe(10)
    })
})