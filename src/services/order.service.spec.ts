import { Customer } from "../entity/customer"
import { Order } from "../entity/order"
import { OrderItem } from "../entity/order-item"
import { OrderService } from "./order.service"

describe("Order Service unit tests", () => {
    it("should be able to get total of all orders", () => {
        const orderItem1 = new OrderItem("item1", 'item1', "Item 1", 100, 1)
        const orderItem2 = new OrderItem("item2", 'item2', "Item 2", 200, 2)

        const order1 = new Order("order1", "customer1", [orderItem1])
        const order2 = new Order("order1", "customer1", [orderItem2])

        const total = OrderService.total([order1, order2])

        expect(total).toBe(500)
    })

    it("should be able to place an order", () => {
        const customer = new Customer("customer1", "Customer 1")
        const item1 = new OrderItem("item1", 'item1', "Item 1", 100, 1)

        const order = OrderService.placeOrder(customer, [item1])

        expect(customer.rewardPoints).toBe(50)
        expect(order.total()).toBe(100)
    })

    it("should be able to throw an error if order items is empty", () => {
        const customer = new Customer("customer1", "Customer 1")
        expect(() => OrderService.placeOrder(customer, [])).toThrow("Order must have at least one item")
    })
})