import { ProductFactory } from "../../../domain/product/factory/product.factory";
import { ProductRepositoryInterface } from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDto, OutputListProductDto } from "./list.product.dto";

export class ListProductUseCase {
    private productRepository: ProductRepositoryInterface

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository
    }

    async execute(input?: InputListProductDto): Promise<OutputListProductDto> {
        const products = await this.productRepository.fetchAll()

        return {
            products: products.map(product => {
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price
                }
            })
        }
    }
}