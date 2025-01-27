import { SendEmailWhenProductIsCreatedHandler } from "../../product/event/handler/send-email-when-product-is-created.handler"
import { ProductCreatedEvent } from "../../product/event/product-created.event"
import { EventDispatcher } from "./event-dispatcher"

describe("Domain Events tests", () => {

    it("should be able to register an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers.has("ProductCreatedEvent")).toBeTruthy()
        expect(eventDispatcher.getEventHandlers.get("ProductCreatedEvent")[0]).toBe(eventHandler)
        expect(eventDispatcher.getEventHandlers.get("ProductCreatedEvent").length).toBe(1)
    })

    it("should be able to unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler)

        expect(eventDispatcher.getEventHandlers.get("ProductCreatedEvent").indexOf(eventHandler)).toBe(-1)
    })

    it("should be able to throw an error when trying to unregister an event handler that does not exist", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        expect(() => eventDispatcher.unregister("ProductCreatedEvent", eventHandler)).toThrow("Event not found")
    })

    it("should be able to unregister all events", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()

        eventDispatcher.register("ProductCreatedEvent", eventHandler)
        eventDispatcher.register("product.updated", eventHandler)
        eventDispatcher.register("product.sent", eventHandler)
        eventDispatcher.unregisterAll()

        expect(eventDispatcher.getEventHandlers.size).toBe(0)
    })

    it("should be able to notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher()
        const eventHandler = new SendEmailWhenProductIsCreatedHandler()
        const spyEventHandler = jest.spyOn(eventHandler, "handle")

        eventDispatcher.register("ProductCreatedEvent", eventHandler)

        const productCreatedEvent = new ProductCreatedEvent({ name: "Product 1", price: 100 })

        eventDispatcher.notify(productCreatedEvent)

        expect(spyEventHandler).toHaveBeenCalledTimes(1)
        expect(spyEventHandler).toHaveBeenCalledWith(productCreatedEvent)
    })

})