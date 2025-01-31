import { Address } from "../../../domain/customer/entity/value-objects/address";
import { CustomerRepositoryInterface } from "../../../domain/customer/repository/customer-repository.interface";
import { InputUpdateCustomerDto, OutputUpdateCustomerDto } from "./update.customer.dto";

export class UpdateCustomerUseCase {
    private customerRepository: CustomerRepositoryInterface

    constructor(customerRepository: CustomerRepositoryInterface) {
        this.customerRepository = customerRepository
    }

    async execute(input: InputUpdateCustomerDto): Promise<OutputUpdateCustomerDto> {
        const customer = await this.customerRepository.getById(input.id)

        customer.changeName(input.name)
        customer.changeAddress(new Address(input.address.street, input.address.number, input.address.zip, input.address.city))

        await this.customerRepository.update(customer)

        return {
            id: customer.id,
            name: customer.name,
            address: {
                street: customer.address.street,
                city: customer.address.city,
                number: customer.address.number,
                zip: customer.address.zip
            }
        }
    }
}