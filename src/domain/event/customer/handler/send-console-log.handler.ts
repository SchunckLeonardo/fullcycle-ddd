import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { AddressChangedEvent } from "../address-changed.event";

export class SendConsoleLogHandler implements EventHandlerInterface<AddressChangedEvent> {
    handle(event: AddressChangedEvent): void {
        const { id, name, address } = event.eventData;
        console.log(`Customer address: ${id}, ${name} changed to ${address}`);
    }
}