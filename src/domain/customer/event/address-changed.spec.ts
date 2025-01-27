import { Sequelize } from "sequelize-typescript"
import { CustomerModel } from "../../../infrastructure/customer/repository/sequelize/model/customer.model"
import { CustomerRepository } from "../../../infrastructure/customer/repository/customer.repository"
import { AddressChangedEvent } from "./address-changed.event"
import { SendConsoleLogHandler } from "./handler/send-console-log.handler"
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

    it("should be able to dispatch an event when customer address is changed", async () => {
        const customer = new Customer("1", "John Doe")
        const address = new Address("123 Main St.", 123, "Zip 1", "City 1")
        customer.changeAddress(address)

        const customerRepository = new CustomerRepository()

        await customerRepository.create(customer)
        const newAddress = new Address("456 Main St.", 456, "Zip 2", "City 2")

        customer.changeAddress(newAddress)

        await customerRepository.update(customer)

        const eventDispatcher = new EventDispatcher()

        const eventData = {
            id: customer.id,
            name: customer.name,
            address: customer.address
        }

        const sendConsoleLogHandler = new SendConsoleLogHandler()

        const addressChangedEvent = new AddressChangedEvent(eventData)

        eventDispatcher.register("AddressChangedEvent", sendConsoleLogHandler)

        const sendConsoleLogHandlerSpy = jest.spyOn(sendConsoleLogHandler, "handle")

        eventDispatcher.notify(addressChangedEvent)

        expect(sendConsoleLogHandlerSpy).toHaveBeenCalledWith(addressChangedEvent)
    })
})