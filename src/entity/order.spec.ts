import { Order } from "./order"
import { OrderItem } from "./order-item"

describe("Order unit tests", () => {
    it("should be able to throw an error when ID is empty", () => {
        expect(() => new Order("", "123", [])).toThrow("ID is required")
    })

    it("should be able to throw an error when CustomerId is empty", () => {
        expect(() => new Order("123", "", [])).toThrow("Customer ID is required")
    })

    it("should be able to throw an error when Items is empty", () => {
        expect(() => new Order("123", "123", [])).toThrow("Item quantity must be greater than 0")
    })

    it("should be able to calculate the total", () => {
        const item1 = new OrderItem("1", "p1", "item1", 10, 2)
        const item2 = new OrderItem("2", "p2", "item2", 20, 5)

        const order = new Order("123", "123", [item1, item2])

        expect(order.total()).toBe(120)
    })

    it("should be able to throw an error if order item quantity is less than 1", () => {
        expect(() => {
            const item1 = new OrderItem("1", "p1", "item1", 10, 0)
            const item2 = new OrderItem("2", "p2", "item2", 20, -2)

            const _ = new Order("123", "123", [item1, item2])
        }).toThrow("Quantity should be greater than 0")
    })
})