export type EventType = string | symbol;

export type Handler<T = any> = (event?: T) => void;
export type WildcardHandler = (type: EventType, event?: any) => void;

export type EventHandlerList = Array<Handler>;
export type WildCardEventHandlerList = Array<WildcardHandler>;

export type EventHandlerMap = Map<EventType, EventHandlerList | WildCardEventHandlerList>;

export interface Emitter {
    all: EventHandlerMap;

    on<T = any>(type: EventType, handler: Handler<T>): void;
    on(type: "*", handler: WildcardHandler): void;

    off<T = any>(type: EventType, handler: Handler<T>): void;
    off(type: "*", handler: WildcardHandler): void;

    emit<T = any>(type: EventType, ...event: T[]): void;
    emit(type: "*", ...event: any): void;
}

export default function eventHub(): Emitter {
    const all = new Map() as EventHandlerMap;

    return {
        all,

        on<T = any>(type: EventType, handler: Handler<T>) {
            const handlers = all.get(type);
            const added = handlers && handlers.push(handler);
            if (!added) {
                all.set(type, [handler]);
            }
        },

        off<T = any>(type: EventType, handler: Handler<T>) {
            const handlers = all.get(type);
            if (handlers) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1);
            }
        },

        emit<T = any>(type: EventType, ...evt: T[]) {
            ((all.get(type) || []) as EventHandlerList).slice().map((handler) => {
                handler(...evt);
            });
            ((all.get("*") || []) as WildCardEventHandlerList).slice().map((handler) => {
                handler(type, ...evt);
            });
        },
    };
}
