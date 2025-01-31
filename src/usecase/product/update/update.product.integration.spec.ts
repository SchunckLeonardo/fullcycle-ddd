import { Sequelize } from "sequelize-typescript"
import { ProductRepository } from "../../../infrastructure/product/repository/product.repository"
import { UpdateProductUseCase } from "./update.product.usecase"
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/model/product.model"
import { ProductFactory } from "../../../domain/product/factory/product.factory"

describe("Update product usecase integration tests", () => {
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

    it("should be able to update a product", async () => {
        const productRepository = new ProductRepository()
        const sut = new UpdateProductUseCase(productRepository)

        const product = ProductFactory.create("Product 1", 100)

        await productRepository.create(product)

        const input = {
            id: product.id,
            name: "Product 2",
            price: 500
        }

        const output = await sut.execute(input)

        const expectedOutput = {
            id: input.id,
            name: input.name,
            price: input.price
        }

        expect(output).toStrictEqual(expectedOutput)
        expect(expectedOutput.name).toStrictEqual(output.name)
        expect(expectedOutput.price).toStrictEqual(output.price)
    })
})