import { Sequelize } from "sequelize-typescript"
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/model/product.model"
import { ProductRepository } from "../../../infrastructure/product/repository/product.repository"
import { FindProductUseCase } from "./find.product.usecase"
import { ProductFactory } from "../../../domain/product/factory/product.factory"

describe("Find product usecase integration test", () => {
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

    it("should be able to find a product", async () => {
        const productRepository = new ProductRepository()
        const sut = new FindProductUseCase(productRepository)

        const product = ProductFactory.create("Product 1", 10)
        await productRepository.create(product)

        const input = {
            id: product.id
        }

        const output = await sut.execute(input)

        const outputExpected = {
            id: product.id,
            name: product.name,
            price: product.price
        }

        expect(output).toStrictEqual(outputExpected)
    })
})