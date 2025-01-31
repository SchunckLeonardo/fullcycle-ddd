import { Sequelize } from "sequelize-typescript"
import { ProductRepository } from "../../../infrastructure/product/repository/product.repository"
import { ListProductUseCase } from "./list.product.usecase"
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/model/product.model"
import { ProductFactory } from "../../../domain/product/factory/product.factory"

describe("List product usecase integration tests", () => {
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

    it("should be able to list products", async () => {
        const product1 = ProductFactory.create("Product 1", 100)
        const product2 = ProductFactory.create("Product 2", 200)

        const productRepository = new ProductRepository()
        const sut = new ListProductUseCase(productRepository)

        await productRepository.create(product1)
        await productRepository.create(product2)

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