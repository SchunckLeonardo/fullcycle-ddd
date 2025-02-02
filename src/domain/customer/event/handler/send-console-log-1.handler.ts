import { EventHandlerInterface } from "../../../@shared/event/event-handler.interface";
import { CustomerCreatedEvent } from "../customer-created.event";

export class SendConsoleLog1Handler implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log("This is the first console.log of event: ", event.constructor.name)
    }
}