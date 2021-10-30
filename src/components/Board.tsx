/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";

export default class Board<P> extends Component<{}, BoardState> {
    private timer: Timer;
    public isGameStart: boolean = false;

    public constructor(props: P) {
        super(props);

        this.timer = new Timer(this);
        this.state = {
            minute: "00",
            second: "00",
            score: 0
        };
    }

    public render(): ReactElement {
        return (
            <div className="board-container">
                <ul>
                    <li>Score<p>{this.state.score}</p></li>
                    <li>Time<p>{this.state.minute}:{this.state.second}</p></li>
                </ul>
            </div>
        );
    }

    public componentDidMount(): void {
        document.body.addEventListener("keydown", (e) => {
            if(e.key == " " && !this.isGameStart) { // game start
                e.preventDefault();
                this.timer.start();
                this.isGameStart = true;
            }
        });
        document.body.addEventListener("gameStop", () => {
            this.timer.stop();
        });
        document.body.addEventListener("getScore", (e: CustomEvent) => {
            this.setState({
                score: e.detail.score
            });
        });
        document.body.addEventListener("gameReset", () => {
            this.isGameStart = false;
            this.timer.reset();
        });
    }
}

class Timer {
    private component: Board<{}>;
    private interval: any = null;

    private minute: number = 0;
    private second: number = 0;

    public constructor(component: Board<{}>) {
        this.component = component;
    }

    public start(): void {
        if(this.component.isGameStart) return;

        this.interval = setInterval(() => {
            this.second++;
            if(this.second >= 60) {
                this.second = 0;
                this.minute++;
            }

            this.component.setState({
                minute: this.minute < 10 ? "0"+ this.minute.toString() : this.minute.toString(),
                second: this.second < 10 ? "0"+ this.second.toString() : this.second.toString()
            });
        }, 1000);
    }

    public stop(): void {
        clearInterval(this.interval);
    }

    public reset(): void {
        this.stop();
        this.minute = this.second = 0;
        this.component.setState({
            minute: "00",
            second: "00",
            score: 0
        });
    }
}

interface BoardState {
    minute: string
    second: string
    score: number
}
