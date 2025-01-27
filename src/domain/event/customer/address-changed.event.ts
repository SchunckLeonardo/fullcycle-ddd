import { EventInterface } from "../@shared/event.interface";

export class AddressChangedEvent implements EventInterface {
    dataTimeOccured: Date;
    eventData: any;

    constructor(eventData: any) {
        this.dataTimeOccured = new Date();
        this.eventData = eventData;
    }
}