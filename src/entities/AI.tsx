/* eslint-disable eqeqeq */
import Snake from "../objects/Snake";
import Game from "../components/Game";
import Ghost from "./Ghost";
import GhostGray from "./GhostGray";
import Utils from "../utils";
import { Dir } from "../components/Dir";

export class GhostAI {
    private game: Game<{}>;
    private snake: Snake;
    private self: Ghost;
    private cycleTimer: any;

    private direction: Dir = Dir.RIGHT;
    
    public constructor(game: Game<{}>, self: Ghost) {
        this.game = game;
        this.snake = this.game.snake;
        this.self = self;

        this.cycleTimer = setInterval(() => this.cycle(), 150);
        document.body.addEventListener("snakeMove", () => this.onMove());
    }

    private cycle(): void {
        var selfPosition = this.self.getPosition();

        switch(this.direction) {
            case Dir.UP:
                this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y - 1});
                break;
            case Dir.DOWN:
                this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y + 1});
                break;
            case Dir.LEFT:
                this.self.setPosition({x: selfPosition.x - 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
                break;
            case Dir.RIGHT:
                this.self.setPosition({x: selfPosition.x + 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
                break;
        }
    }

    private onMove(): void {
        var headPosition = this.snake.getHeadPosition();
        var selfPosition = this.self.getPosition();

        if(selfPosition.x < headPosition.x) {
            this.setDirection(Dir.RIGHT);
        } else if(selfPosition.x > headPosition.x) {
            this.setDirection(Dir.LEFT);
        }

        if(selfPosition.x == headPosition.x) {
            if(selfPosition.y < headPosition.y) {
                this.setDirection(Dir.DOWN);
            } else if(selfPosition.y > headPosition.y) {
                this.setDirection(Dir.UP);
            }
        }
    }

    private setDirection(dir: Dir): void {
        this.direction = dir;
    }

    public clearCycle(): void {
        clearInterval(this.cycleTimer);
    }
}

export class GhostGrayAI {
    private game: Game<{}>;
    private snake: Snake;
    private self: GhostGray;
    private cycleTimer: any;

    private direction: Dir = Dir.RIGHT;
    
    public constructor(game: Game<{}>, self: GhostGray) {
        this.game = game;
        this.snake = this.game.snake;
        this.self = self;

        this.cycleTimer = setInterval(() => this.cycle(), 150);
        document.body.addEventListener("snakeMove", () => this.onMove());
    }

    private cycle(): void {
        var selfPosition = this.self.getPosition();

        switch(this.direction) {
            case Dir.UP:
                this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y - 1});
                break;
            case Dir.DOWN:
                this.self.setPosition({x: selfPosition.x + Utils.getRandomPN(0, 1), y: selfPosition.y + 1});
                break;
            case Dir.LEFT:
                this.self.setPosition({x: selfPosition.x - 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
                break;
            case Dir.RIGHT:
                this.self.setPosition({x: selfPosition.x + 1, y: selfPosition.y + Utils.getRandomPN(0, 1)});
                break;
        }
    }

    private onMove(): void {
        var headPosition = this.snake.getHeadPosition();
        var selfPosition = this.self.getPosition();

        if(selfPosition.y < headPosition.y) {
            this.setDirection(Dir.DOWN);
        } else if(selfPosition.y > headPosition.y) {
            this.setDirection(Dir.UP);
        }

        if(selfPosition.y == headPosition.y) {
            if(selfPosition.x < headPosition.x) {
                this.setDirection(Dir.RIGHT);
            } else if(selfPosition.x > headPosition.x) {
                this.setDirection(Dir.LEFT);
            }
        }
    }

    private setDirection(dir: Dir): void {
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
