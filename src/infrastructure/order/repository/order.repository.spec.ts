import { Sequelize } from "sequelize-typescript"
import { CustomerModel, OrderItemModel, OrderModel, ProductModel } from "../../@shared/db/sequelize/model/models"
import { Order } from "../../../domain/checkout/entity/order"
import { OrderItem } from "../../../domain/checkout/entity/order-item"
import { Customer } from "../../../domain/customer/entity/customer"
import { Address } from "../../../domain/customer/entity/value-objects/address"
import { Product } from "../../../domain/product/entity/product"
import { CustomerRepository } from "../../customer/repository/customer.repository"
import { ProductRepository } from "../../product/repository/product.repository"
import { OrderRepository } from "./order.repository"

describe("Order Repository unit tests", () => {
    let sequelize: Sequelize

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([OrderModel, CustomerModel, ProductModel, OrderItemModel])
        await sequelize.sync()
    })

    afterAll(async () => {
        await sequelize.close()
    })

    afterEach(async () => {
        await OrderModel.destroy({ truncate: true })
        await CustomerModel.destroy({ truncate: true })
        await ProductModel.destroy({ truncate: true })
        await OrderItemModel.destroy({ truncate: true })
    })

    it("should be able to create a new order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "John Doe")
        const address = new Address("Street 1", 1, "Zip 1", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2)

        const orderRepository = new OrderRepository()
        const order = new Order("1", customer.id, [orderItem])
        await orderRepository.create(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: product.id,
                    quantity: orderItem.quantity,
                    name: orderItem.name,
                    price: orderItem.price,
                    order_id: order.id,
                },
            ],
        })
    })

    it("should be able to update an order", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "John Doe")
        const address = new Address("Street 1", 1, "Zip 1", "City 1")
        customer.changeAddress(address)

        await customerRepository.create(customer)

        const productRepository = new ProductRepository()

        const product = new Product("1", "Product 1", 10)
        const newProduct = new Product("2", "Product 2", 20)
        
        await productRepository.create(product)

        const newProduct2 = new Product("1", "Product 3", 30)

        await productRepository.update(newProduct2)

        await productRepository.create(newProduct)

        const orderItem = new OrderItem("1", newProduct2.id, newProduct2.name, newProduct2.price, 2)

        const orderRepository = new OrderRepository()
        const order = new Order("1", customer.id, [orderItem])

        await orderRepository.create(order)

        const newOrderItem = new OrderItem("2", newProduct.id, newProduct.name, newProduct.price, 3)
        order.addItem(newOrderItem)

        await orderRepository.update(order)

        const orderModel = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    product_id: product.id,
                    quantity: orderItem.quantity,
                    name: orderItem.name,
                    price: orderItem.price,
                    order_id: order.id,
                },
                {
                    id: newOrderItem.id,
                    product_id: newProduct.id,
                    quantity: newOrderItem.quantity,
                    name: newOrderItem.name,
                    price: newOrderItem.price,
                    order_id: order.id,
                },
            ],
        })
    })

    it("should be able to get an order by id", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "John Doe")
        const address = new Address("Street 1", 1, "Zip 1", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2)

        const orderRepository = new OrderRepository()
        const order = new Order("1", customer.id, [orderItem])
        await orderRepository.create(order)

        const orderModel = await orderRepository.getById(order.id)
        const orderFounded = await OrderModel.findOne({ where: { id: order.id }, include: ["items"] })

        expect(orderModel.id).toBe(orderFounded.id)
        expect(orderModel.customerId).toBe(orderFounded.customer_id)
        expect(orderModel.items[0].id).toBe(orderFounded.items[0].id)
        expect(orderModel.items[0].productId).toBe(orderFounded.items[0].product_id)
        expect(orderModel.items[0].quantity).toBe(orderFounded.items[0].quantity)
        expect(orderModel.items[0].name).toBe(orderFounded.items[0].name)
        expect(orderModel.items[0].price).toBe(orderFounded.items[0].price)
    })

    it("should be able to throw an error when order is not found", async () => {
        const orderRepository = new OrderRepository()

        await expect(() => orderRepository.getById("1")).rejects.toThrow("Order not found")
    })

    it("should be able to fetch all orders", async () => {
        const customerRepository = new CustomerRepository()
        const customer = new Customer("1", "John Doe")
        const address = new Address("Street 1", 1, "Zip 1", "City 1")
        customer.changeAddress(address)
        await customerRepository.create(customer)

        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10)
        await productRepository.create(product)

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2)

        const orderRepository = new OrderRepository()
        const order = new Order("1", customer.id, [orderItem])
        await orderRepository.create(order)

        const customer2 = new Customer("2", "Mary Doe")
        const address2 = new Address("Street 2", 2, "Zip 2", "City 2")
        customer2.changeAddress(address2)
        await customerRepository.create(customer2)

        const product2 = new Product("2", "Product 2", 20)
        await productRepository.create(product2)

        const orderItem2 = new OrderItem("2", product2.id, product2.name, product2.price, 2)

        const order2 = new Order("2", customer2.id, [orderItem2])
        await orderRepository.create(order2)

        const orders = await orderRepository.fetchAll()

        expect(orders.length).toBe(2)
        expect(orders[0].id).toBe(order.id)
        expect(orders[1].id).toBe(order2.id)
    })
})