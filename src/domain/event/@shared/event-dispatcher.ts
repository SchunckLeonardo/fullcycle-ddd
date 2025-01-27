import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export class EventDispatcher implements EventDispatcherInterface {
    private eventsHandlers: Map<string, EventHandlerInterface[]> = new Map<string, EventHandlerInterface[]>();

    get getEventHandlers(): Map<string, EventHandlerInterface[]> {
        return this.eventsHandlers;
    }

    notify(event: EventInterface): void {
        const eventName = event.constructor.name;

        if (!this.eventsHandlers.has(eventName)) {
            return
        }

        this.eventsHandlers.get(eventName).forEach(handler => handler.handle(event));
    }

    register(eventName: string, eventHandler: EventHandlerInterface): void {
        if (!this.eventsHandlers.has(eventName)) {
            this.eventsHandlers.set(eventName, []);
        }

        this.eventsHandlers.get(eventName).push(eventHandler);
    }

    unregister(eventName: string, eventHandler: EventHandlerInterface): void {
        if (!this.eventsHandlers.has(eventName)) {
            throw new Error("Event not found");
        }

        this.eventsHandlers.set(eventName, this.eventsHandlers.get(eventName).filter(handler => handler !== eventHandler))
    }

    unregisterAll(): void {
        this.eventsHandlers.clear();
    }
}