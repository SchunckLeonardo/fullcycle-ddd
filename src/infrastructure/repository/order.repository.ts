import { Order } from "../../domain/entity/order";
import { OrderItem } from "../../domain/entity/order-item";
import { OrderRepositoryInterface } from "../../domain/repository/order-repository.interface";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";

export class OrderRepository implements OrderRepositoryInterface {
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }, {
            include: [{model: OrderItemModel}]
        })
    }

    async fetchAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({include: ["items"]})

        return orderModels.map(orderModel => {
            return new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => {
                return new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity)
            }))
        })
    }

    async getById(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({where: {id}, include: ["items"]})

        if (!orderModel) {
            throw new Error("Order not found")
        }

        const order = new Order(orderModel.id, orderModel.customer_id, orderModel.items.map(item => {
            return new OrderItem(item.id, item.product_id, item.name, item.price, item.quantity)
        }))

        return order
    }
    async update(entity: Order): Promise<void> {
        entity.items.forEach(async (item) => {
            const orderItem = await OrderItemModel.findOne({where: {id: item.id}})

            if (!orderItem) {
                await OrderItemModel.create({
                    id: item.id,
                    product_id: item.productId,
                    order_id: entity.id,
                    quantity: item.quantity,
                    name: item.name,
                    price: item.price
                })
            }

            await OrderItemModel.update({
                product_id: item.productId,
                order_id: entity.id,
                quantity: item.quantity,
                name: item.name,
                price: item.price
            }, {
                where: {id: item.id}
            })
        })

        await OrderModel.update({
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }, {
            where: {id: entity.id}
        })
    }
}