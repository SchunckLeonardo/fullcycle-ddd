import { Sequelize } from "sequelize-typescript"
import { ProductRepository } from "../../../infrastructure/product/repository/product.repository"
import { CreateProductUseCase } from "./create.product.usecase"
import { ProductModel } from "../../../infrastructure/product/repository/sequelize/model/product.model"

describe("Create product usecase integration tests", () => {
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
        const input = {
            name: "Product 1",
            price: 100
        }

        const productRepository = new ProductRepository()
        const sut = new CreateProductUseCase(productRepository)

        const output = await sut.execute(input)

        const expectedOutput = {
            id: expect.any(String),
            name: input.name,
            price: input.price
        }

        const productFound = await productRepository.getById(output.id)

        expect(output).toStrictEqual(expectedOutput)
        expect(productFound.name).toStrictEqual(output.name)
        expect(productFound.price).toStrictEqual(output.price)
    })
})