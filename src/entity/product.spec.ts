import { Product } from "./product"

describe("Product unit tests", () => {
    it("should be able to throw an error if ID is empty", () => {
        expect(() => {
            new Product("", "Product Name", 100)
        }).toThrow("ID is required")
    })

    it("should be able to throw an error if name is empty", () => {
        expect(() => {
            new Product("123", "", 100)
        }).toThrow("Name is required")
    })

    it("should be able to throw an error if price is empty", () => {
        expect(() => {
            new Product("123", "Name", 0)
        }).toThrow("Price should be greater than 0")
    })

    it("should be able to change product name", () => {
        const product = new Product("123", "Name", 100)
        product.changeName("New Name")
        expect(product.name).toEqual("New Name")
    })

    it("should be able to change product price", () => {
        const product = new Product("123", "Name", 100)
        product.changePrice(200)
        expect(product.price).toEqual(200)
    })
})