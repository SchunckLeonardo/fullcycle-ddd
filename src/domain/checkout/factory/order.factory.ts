import { v4 } from "uuid"
import { Order } from "../entity/order"
import { OrderItem } from "../entity/order-item"

interface OrderFactoryProps {
    id?: string
    customerId: string
    items: {
        id?: string
        name: string
        productId: string
        quantity: number
        price: number
    }[]
}

export class OrderFactory {
    static create(orderProps: OrderFactoryProps) {
        const items = orderProps.items.map(item => {
            return new OrderItem(item.id ?? v4(), item.productId, item.name, item.price, item.quantity)
        })

        return new Order(orderProps.id ?? v4(), orderProps.customerId, items)
    }
}