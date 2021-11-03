/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Dir } from "./Dir";
import Snake from "../objects/Snake";
import Food from "../objects/Food";
import Bomb from "../objects/Bomb";
import Candy from "../objects/Candy";
import Snickers from "../objects/Snickers";
import Utils from "../utils";

export default class Game<P> extends Component<{}, GameState> {
    private snake: Snake;
    public food: Food;
    public bomb: Bomb | null;
    public candy: Candy | null;
    public snickers: Snickers | null;

    public throughWall: boolean = true;
    public isGameStart: boolean = false;
    public doIgnoreBomb: boolean = false;
    public score: number = 0;
    public speed: number = 150;

    public timerMove: any;
    private maxSpeed: number = 300;
    
    public constructor(props: P) {
        super(props);

        this.state = {};
        this.snake = new Snake(3, this);
        this.food = new Food({
            x: Utils.getRandom(0, 79),
            y: Utils.getRandom(0, 49)
        }, this);
        this.bomb = null;
        this.candy = null;
        this.snickers = null;
    }

    private start(): void {
        this.isGameStart = true;

        this.timerMove = setInterval(() => {
            this.snake.move();
        }, this.maxSpeed - this.speed);
    }

    public stop(): void {
        alert("You Died\nBe more carefully next time...");
        clearInterval(this.timerMove);

        var gameStopEvent = new CustomEvent("gameStop");
        document.body.dispatchEvent(gameStopEvent);
    }

    public setSpeed(speed: number): void {
        if(speed >= this.maxSpeed) return;
        this.speed = speed;

        clearInterval(this.timerMove);
        this.timerMove = setInterval(() => {
            this.snake.move();
        }, this.maxSpeed - this.speed);
    }

    public render(): ReactElement {
        return (
            <div className="game-container" id="game"></div>
        );
    }

    public componentDidMount(): void {
        this.snake.init();
        this.food.display();

        var throughWall = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any).throughWall;
        this.throughWall = throughWall;

        document.body.addEventListener("keydown", (e) => {
            switch(e.key) {
                case " ": // game start
                    if(!this.isGameStart) {
                        e.preventDefault();
                        this.start();
                    }
                    break;
                case "ArrowUp":
                    if(this.snake.getDirection() == Dir.DOWN || !this.isGameStart) return;
                    this.snake.setDirection(Dir.UP);
                    break;
                case "ArrowDown":
                    if(this.snake.getDirection() == Dir.UP || !this.isGameStart) return;
                    this.snake.setDirection(Dir.DOWN);
                    break;
                case "ArrowLeft":
                    if(this.snake.getDirection() == Dir.RIGHT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.LEFT);
                    break;
                case "ArrowRight":
                    if(this.snake.getDirection() == Dir.LEFT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.RIGHT);
                    break;
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "throughWall") {
                this.throughWall = e.detail.enabled;
            }
        });
        document.body.addEventListener("gameReset", () => {
            this.snake = new Snake(3, this);
            this.snake.init();

            // Display the snake first, instead of displaying the food first.
            // When the snake is inited, it will remove all the elements under the game container.
            // So if the food goes first, the food will be removed by the snake.
            this.food = new Food({
                x: Utils.getRandom(0, 79),
                y: Utils.getRandom(0, 49)
            }, this);
            this.food.display();
            this.bomb = null;

            this.score = 0;
            this.isGameStart = false;

            clearInterval(this.timerMove);
            this.timerMove = null;
        });
    }
}

interface GameState {

}
