import { Address } from "../../../domain/customer/entity/value-objects/address";
import { CustomerFactory } from "../../../domain/customer/factory/customer.factory";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { InputCreateCustomerDto, OutputCreateCustomerDto } from "./create.customer.dto";

export class CreateCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository
    }

    async execute(input: InputCreateCustomerDto): Promise<OutputCreateCustomerDto> {
        const address = new Address(input.address.street, input.address.number, input.address.zip, input.address.city)
        const customer = CustomerFactory.createWithAddress(input.name, address)

        await this.customerRepository.create(customer)

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                city: customer.address.city,
                zip: customer.address.zip,
                number: customer.address.number
            }
        }
    }
}