/* eslint-disable eqeqeq */
import Utils from "../utils";

export default class TimersManager {
    private timers: Timer[] = [];
    private window: Window;

    public constructor(window: Window) {
        this.window = window;
    }
    
    public register(timer: Timer): void {
        this.timers.push(timer);
    }

    public remove(name: string): void {
        for(let i = 0; i < this.timers.length; i++) {
            if(this.timers[i].name == name) this.clear(this.timers[i]);
        }
    }

    public removeAll(): void {
        for(let i = 0; i < this.timers.length; i++) this.clear(this.timers[i]);
    }

    private clear(timer: Timer): void {
        if(timer.type == "interval") this.window.clearInterval(timer.timer);
        if(timer.type == "timeout") this.window.clearTimeout(timer.timer);
        this.timers = Utils.arrayItemDelete(this.timers, timer);
    }
}

interface Timer {
    name: string
    timer: any
    type: "interval" | "timeout"
}
