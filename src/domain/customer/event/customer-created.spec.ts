import { Sequelize } from "sequelize-typescript"
import { SendConsoleLog1Handler } from "./handler/send-console-log-1.handler"
import { SendConsoleLog2Handler } from "./handler/send-console-log-2.handler"
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/model/customer.model"
import { CustomerRepository } from "../../../infrastructure/customer/repository/customer.repository"
import { CustomerCreatedEvent } from "./customer-created.event"
import { Customer } from "../entity/customer"
import { Address } from "../entity/value-objects/address"
import { EventDispatcher } from "../../@shared/event/event-dispatcher"

describe("CustomerCreated Event", () => {
    let sequelize: Sequelize

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        })

        sequelize.addModels([CustomerModel])
        await sequelize.sync()
    })

    afterAll(async () => {
        await sequelize.close()
    })

    afterEach(async () => {
        await CustomerModel.destroy({ truncate: true })
    })

    it("should be able to dispatch an event when customer is created", async () => {
        const customer = new Customer("1", "John Doe")
        const address = new Address("123 Main St.", 123, "Zip 1", "City 1")
        customer.changeAddress(address)

        const customerRepository = new CustomerRepository()

        await customerRepository.create(customer)

        const eventDispatcher = new EventDispatcher()

        const eventHandler1 = new SendConsoleLog1Handler()
        const eventHandler2 = new SendConsoleLog2Handler()

        const customerCreatedEvent = new CustomerCreatedEvent(customer)

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1)
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2)

        const eventHandler1Spy = jest.spyOn(eventHandler1, "handle")
        const eventHandler2Spy = jest.spyOn(eventHandler2, "handle")

        eventDispatcher.notify(customerCreatedEvent)

        expect(eventHandler1Spy).toHaveBeenCalledWith(customerCreatedEvent)
        expect(eventHandler2Spy).toHaveBeenCalledWith(customerCreatedEvent)
    })
})