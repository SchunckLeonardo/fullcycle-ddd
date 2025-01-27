import { Customer } from "../../domain/entity/customer";
import { Address } from "../../domain/entity/value-objects/address";
import { CustomerRepositoryInterface } from "../../domain/repository/customer-repository.interface";
import { CustomerModel } from "../db/sequelize/model/customer.model";

export class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        })
    }

    async update(entity: Customer): Promise<void> {
        await CustomerModel.update({
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        }, {
            where: { id: entity.id }
        })
    }

    async getById(id: string): Promise<Customer> {
        const customerModel = await CustomerModel.findOne({ where: { id } })
        
        if (!customerModel) {
            throw new Error('Customer not found')
        }

        const customer = new Customer(customerModel.id, customerModel.name)
        customer.changeAddress(new Address(customerModel.street, customerModel.number, customerModel.zipcode, customerModel.city))
        customer.addRewardPoints(customerModel.rewardPoints)
        if (customerModel.active) {
            customer.activate()
        } else {
            customer.deactivate()
        }
        return customer
    }

    async fetchAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll()
        return customerModels.map((customer) => {
            const customerEntity = new Customer(customer.id, customer.name)
            customerEntity.changeAddress(new Address(customer.street, customer.number, customer.zipcode, customer.city))
            customerEntity.addRewardPoints(customer.rewardPoints)
            if (customer.active) {
                customerEntity.activate()
            } else {
                customerEntity.deactivate()
            }
            return customerEntity
        })
    }
}