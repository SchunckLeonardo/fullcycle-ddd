import { Sequelize } from "sequelize-typescript"
import { ProductModel } from "./sequelize/model/product.model"
import { Product } from "../../../domain/product/entity/product"
import { ProductRepository } from "./product.repository"

describe("Product Repository unit tests", () => {

    let sequelize: Sequelize

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([ProductModel])
        await sequelize.sync()
    })

    afterAll(async () => {
        await sequelize.close()
    })

    afterEach(async () => {
        await ProductModel.destroy({ truncate: true })
    })

    it("should be able to create a product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10.0)

        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: "1" } })

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 1",
            price: 10.0,
        })
    })

    it("should be able to update a product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10.0)

        await productRepository.create(product)

        product.changeName("Product 2")
        product.changePrice(20.0)

        await productRepository.update(product)

        const productModel = await ProductModel.findOne({ where: { id: "1" } })

        expect(productModel.toJSON()).toStrictEqual({
            id: "1",
            name: "Product 2",
            price: 20.0,
        })
    })

    it("should be able to get a product by id", async () => {
        const productRepository = new ProductRepository()
        const product = new Product("1", "Product 1", 10.0)

        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: "1" }})
        const productFound = await productRepository.getById("1")

        expect(productModel.toJSON()).toStrictEqual({
            id: productFound.id,
            name: productFound.name,
            price: productFound.price,
        })
    })

    it("should be able to throw an error when product is not found", async () => {
        const productRepository = new ProductRepository()

        await expect(productRepository.getById("1")).rejects.toThrow("Product not found")
    })

    it("should be able to fetch all products", async () => {
        const productRepository = new ProductRepository()
        const product1 = new Product("1", "Product 1", 10.0)
        const product2 = new Product("2", "Product 2", 20.0)

        await productRepository.create(product1)
        await productRepository.create(product2)

        const products = await productRepository.fetchAll()

        expect(products.length).toBe(2)
        expect(products[0].id).toBe("1")
        expect(products[0].name).toBe("Product 1")
        expect(products[0].price).toBe(10.0)
        expect(products[1].id).toBe("2")
        expect(products[1].name).toBe("Product 2")
        expect(products[1].price).toBe(20.0)
    })

})