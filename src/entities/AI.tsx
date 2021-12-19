/* eslint-disable eqeqeq */
import Snake from "../objects/Snake";
import Game from "../components/Game";
import { Dir } from "../components/Dir";

export default class AI<S> {
    public game: Game<{}>;
    public snake: Snake;
    public self: S;
    public cycleTimer: any;

    public direction: Dir = Dir.RIGHT;

    public constructor(game: Game<{}>, self: S) {
        this.game = game;
        this.snake = this.game.snake;
        this.self = self;

        this.cycleTimer = setInterval(() => this.cycle(), 150);
        document.body.addEventListener("snakeMove", () => this.onMove());
    }

    public cycle(): void {
        // cycle method
    }

    public onMove(): void {
        // move ai method
    }

    public setDirection(dir: Dir): void {
        this.direction = dir;
    }

    public clearCycle(): void {
        clearInterval(this.cycleTimer);
    }
}

/**
 * @todo Robot AI
 */
export class RobotAI {
    private game: Game<{}>;
    
    public constructor(game: Game<{}>) {
        this.game = game;
    }
}
