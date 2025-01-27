import { OrderItem } from "./order-item"

describe("OrderItem unit tests", () => {
    it("should be able to throw an error if ID is empty", () => {
        expect(() => new OrderItem("", "p1", "item1", 10, 2)).toThrow("ID is required")
    })

    it("should be able to throw an error if ProductId is empty", () => {
        expect(() => new OrderItem("123", "", "item1", 10, 2)).toThrow("Product ID is required")
    })

    it("should be able to throw an error if Name is empty", () => {
        expect(() => new OrderItem("123", "p1", "", 10, 2)).toThrow("Name is required")
    })

    it("should be able to throw an error if product price is less or equal than 0", () => {
        expect(() => new OrderItem("123", "p1", "item1", -45, 2)).toThrow("Price should be greater than 0")
    })

    it("should be able to throw an error if product quantity is less or equal than 0", () => {
        expect(() => new OrderItem("123", "p1", "item1", 5, -2)).toThrow("Quantity should be greater than 0")
    })

    it("should be able to calculate the total", () => {
        const orderItem = new OrderItem("123", "p1", "item1", 10, 2)

        expect(orderItem.orderItemTotal()).toBe(20)
    })
})