type EventCallback = (...args: any[]) => void;

class EventBus {
    private events: Map<string, EventCallback[]> = new Map();

    on(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallback): void {
        if (!this.events.has(event)) return;
        
        const callbacks = this.events.get(event)!;
        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    emit(event: string, ...args: any[]): void {
        if (!this.events.has(event)) return;
        
        this.events.get(event)!.forEach(callback => {
            callback(...args);
        });
    }

    clear(): void {
        this.events.clear();
    }
}

export const eventBus = new EventBus();

// События для модального окна
export const MODAL_EVENTS = {
    OPEN_GIFTS_MODAL: 'open:gifts:modal',
    OPEN_WIN_MODAL: 'open:win:modal',
    CLOSE_MODAL: 'close:modal',
} as const;

