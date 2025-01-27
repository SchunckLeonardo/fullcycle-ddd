import { Product } from "../../domain/entity/product";
import { ProductRepositoryInterface } from "../../domain/repository/product-repository.interface";
import { ProductModel } from "../db/sequelize/model/product.model";

export class ProductRepository implements ProductRepositoryInterface {
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price,
        })
    }

    async getById(id: string): Promise<Product> {
        const productModel = await ProductModel.findOne({ where: { id } })

        if (!productModel) {
            throw new Error('Product not found')
        }

        return new Product(productModel.id, productModel.name, productModel.price)
    }

    async fetchAll(): Promise<Product[]> {
        const products = await ProductModel.findAll()
        return products.map(product => new Product(product.id, product.name, product.price))
    }
    async update(entity: Product): Promise<void> {
        await ProductModel.update({
            name: entity.name,
            price: entity.price,
        }, {
            where: { id: entity.id }
        })
    }
}