/* eslint-disable @typescript-eslint/no-redeclare */
/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Dir } from "./Dir";
import SnakeGame from "../Main";
import { tipMessageRunning } from "../Main";
import Snake from "../objects/Snake";
import Food from "../objects/Food";
import Bomb from "../objects/Bomb";
import Candy from "../objects/Candy";
import Snickers from "../objects/Snickers";
import Ghost from "../entities/Ghost";
import GhostGray from "../entities/GhostGray";
import Utils from "../utils";

export default class Game<P> extends Component<{}, GameState> {
    public snake: Snake;
    public food: Food;
    public bomb: Bomb | null;
    public candy: Candy | null;
    public snickers: Snickers | null;

    public ghost!: Ghost | null;
    public ghostGray!: GhostGray | null;

    public throughWall: boolean = true;
    public generateWall: boolean = false;
    public isGameStart: boolean = false;
    public isRunning: boolean = false;
    public isAbleToRun: boolean = true;
    public doIgnoreBomb: boolean = false;
    public score: number = 0;
    public speed: number = 150;

    private timersManager: Map<string, Timer> = new Map<string, Timer>();

    public timerMove: any;
    private maxSpeed: number = 300;
    
    public constructor(props: P) {
        super(props);

        this.state = {};
        
        var storage = window.localStorage;
        if(storage.getItem("snake-ts.settings") == null) {
            storage.setItem("snake-ts.settings", JSON.stringify({
                colorfulSkin: false,
                throughWall: true,
                skinColor: "#0468d7",
                generateWall: false
            }));
        }
        this.generateWall = JSON.parse(storage.getItem("snake-ts.settings") as any).generateWall;

        this.snake = new Snake(3, this);
        var foodBorder = this.generateWall ? 1 : 0;
        this.food = new Food({
            x: Utils.getRandom(0 + foodBorder, 79 - foodBorder),
            y: Utils.getRandom(0 + foodBorder, 49 - foodBorder)
        }, this);
        this.bomb = null;
        this.candy = null;
        this.snickers = null;
        this.ghost = null;
    }

    private start(): void {
        this.isGameStart = true;

        this.timerMove = setInterval(() => {
            this.snake.move();
        }, this.maxSpeed - this.speed);
    }

    public stop(): void {
        // alert("You Died\nBe more careful next time...");
        var msgbox = document.getElementById("msgbox")
        if(msgbox) msgbox.style.display = "block";

        clearInterval(this.timerMove);

        var gameStopEvent = new CustomEvent("gameStop");
        document.body.dispatchEvent(gameStopEvent);

        var gameResetEvent = new CustomEvent("gameReset");
        document.body.dispatchEvent(gameResetEvent);
    }

    public setSpeed(speed: number): void {
        if(speed >= this.maxSpeed) return;
        this.speed = speed;

        clearInterval(this.timerMove);
        this.timerMove = setInterval(() => {
            this.snake.move();
        }, this.maxSpeed - this.speed);
    }

    private doTurn(turnTo: string): void {
        var turn = new KeyboardEvent("keydown", {
            key: turnTo
        });
        document.body.dispatchEvent(turn);
    }

    private generateRandomWall(): void {
        if(!this.generateWall) return;

        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        // Top & Bottom
        var ax = 0;
        for(var i = 0; i <= 79; i++) {
            putWall(i, ax);
            if(i == 79 && ax == 0) {
                i = 0;
                ax = 49;
            }
        }

        // Left & Right
        var bx = 79;
        for(var i = 1; i <= 49; i++) {
            putWall(bx, i);
            if(i == 49 && bx == 79) {
                i = 0;
                bx = 0;
            }
        }

        for(var i = 0; i < 4; i++) {
            var doorWidth = Utils.getRandom(5, 30), doorBegin = 0;
            switch(i) {
                case 0: // top
                    doorBegin = Utils.getRandom(5, 40);
                    for(let j = doorBegin; j < doorWidth + doorBegin; j++) {
                        breakWall(j, 0);
                    }
                    break;
                case 1: // bottom
                    doorBegin = Utils.getRandom(5, 40);
                    for(let j = doorBegin; j < doorWidth + doorBegin; j++) {
                        breakWall(j, 49);
                    }
                    break;
                case 2: // left
                    doorBegin = Utils.getRandom(5, 12);
                    for(let j = doorBegin; j < doorWidth + doorBegin; j++) {
                        breakWall(0, j);
                    }
                    break;
                case 3: // right
                    doorBegin = Utils.getRandom(5, 12);
                    for(let j = doorBegin; j < doorWidth + doorBegin; j++) {
                        breakWall(79, j);
                    }
                    break;
            }
        }

        function putWall(x: number, y: number): void {
            if(!gameContainer) return;

            var wallElem = document.createElement("div");
            wallElem.className = "wall";
            wallElem.id = "wall-"+ x +"-"+ y;
            wallElem.style.left = 10 * x +"px";
            wallElem.style.top = 10 * y +"px";
            gameContainer.appendChild(wallElem);
        }

        function breakWall(x: number, y: number): void {
            if(!gameContainer) return;

            var wallElem = document.getElementById("wall-"+ x +"-"+ y);
            if(!wallElem) return;

            wallElem.className = "";
            wallElem.id = "";
            wallElem.style.left = wallElem.style.top = "-1";
        }
    }

    public render(): ReactElement {
        return (
            <div className="game-container" id="game"></div>
        );
    }

    public componentDidMount(): void {
        var throughWall = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any).throughWall;
        this.throughWall = throughWall;

        // If the user has opened "generateWall", the "throughWall" button will be disabled,
        // so that the "generateWall" feature won't be meaningless
        if(this.generateWall) {
            var throughWallSwitcher = document.getElementById("throughWall") as HTMLButtonElement;
            if(!throughWallSwitcher) return;

            if(throughWallSwitcher.innerText == "Disabled") {
                throughWallSwitcher.click();
            }
            throughWallSwitcher.disabled = true;
        }

        // If the user has opened "throughWall", the "generateWall", the "generateWall" button will be disabled
        if(!this.throughWall) {
            var generateWallSwitcher = document.getElementById("generateWall") as HTMLButtonElement;
            if(!generateWallSwitcher) return;

            if(generateWallSwitcher.innerText == "Enabled") {
                generateWallSwitcher.click();
            }
            generateWallSwitcher.disabled = true;
        }

        // In here, the snake.init() ought to go first.
        // That's because if the generateRandomWall() goes first, the snake.init method will delete the wall elements when it's executing.
        this.snake.init();
        this.generateRandomWall();
        // The same. No need to explain more.
        this.food.display();

        document.body.addEventListener("keydown", (e: KeyboardEvent) => {
            switch(e.key) {
                case " ": // Game Start
                    if(!this.isGameStart) {
                        e.preventDefault();
                        this.start();
                    }
                    break;
                case "w":
                case "ArrowUp":
                    if(this.snake.getDirection() == Dir.DOWN || !this.isGameStart) return;
                    this.snake.setDirection(Dir.UP);
                    break;
                case "s":
                case "ArrowDown":
                    if(this.snake.getDirection() == Dir.UP || !this.isGameStart) return;
                    this.snake.setDirection(Dir.DOWN);
                    break;
                case "a":
                case "ArrowLeft":
                    if(this.snake.getDirection() == Dir.RIGHT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.LEFT);
                    break;
                case "d":
                case "ArrowRight":
                    if(this.snake.getDirection() == Dir.LEFT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.RIGHT);
                    break;
            }
        });

        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;
        gameContainer.addEventListener("touchstart", (e: TouchEvent) => { // The mobile control code is like a shit
            e.preventDefault();

            var headPosition = this.snake.getHeadPosition();

            var offsetTop = gameContainer?.offsetTop, offsetLeft = gameContainer?.offsetLeft;
            if(!offsetTop || !offsetLeft) return;
            var touchPosition = {
                x: Math.round((e.touches[0].pageX - offsetTop) / 10),
                y: Math.round((e.touches[0].pageY - offsetLeft) / 10)
            };

            // alert("head: "+ headPosition.x +", "+ headPosition.y +" | touch: "+ touchPosition.x +", "+ touchPosition.y);

            var direction = this.snake.getDirection();

            /**
             * @todo Mobile Controls
             */

            if(headPosition.x > touchPosition.x && headPosition.y > touchPosition.y) { // Left Top
                switch(direction) {
                    case Dir.UP:
                    case Dir.DOWN:
                        this.doTurn("a");
                        break;
                    case Dir.LEFT:
                    case Dir.RIGHT:
                        this.doTurn("w");
                        break;
                }
            }
            if(headPosition.x < touchPosition.x && headPosition.y > touchPosition.y) { // Right Top
                switch(direction) {
                    case Dir.UP:
                    case Dir.DOWN:
                        this.doTurn("d");
                        break;
                    case Dir.LEFT:
                    case Dir.RIGHT:
                        this.doTurn("w");
                        break;
                }
            }
            if(headPosition.x > touchPosition.x && headPosition.y < touchPosition.y) { // Left Bottom
                switch(direction) {
                    case Dir.UP:
                    case Dir.DOWN:
                        this.doTurn("a");
                        break;
                    case Dir.LEFT:
                    case Dir.RIGHT:
                        this.doTurn("s");
                        break;
                }
            }
            if(headPosition.x < touchPosition.x && headPosition.x < touchPosition.y) { // Right Bottom
                switch(direction) {
                    case Dir.UP:
                    case Dir.DOWN:
                        this.doTurn("d");
                        break;
                    case Dir.LEFT:
                    case Dir.RIGHT:
                        this.doTurn("s");
                        break;
                }
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "throughWall") {
                this.throughWall = e.detail.enabled;

                var generateWallSwitcher = document.getElementById("generateWall") as HTMLButtonElement;
                if(!generateWallSwitcher) return;

                // Prevent the user enable "generateWall" while the "throughWall" is disabled
                if(!this.throughWall) {
                    if(generateWallSwitcher.innerText == "Enabled") {
                        generateWallSwitcher.click();
                    }
                    generateWallSwitcher.disabled = true;
                } else {
                    generateWallSwitcher.disabled = false;
                }
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
            this.generateRandomWall();
            this.bomb = null;

            this.score = 0;
            this.speed = 150;
            this.isGameStart = false;
            this.isRunning = false;
            this.isAbleToRun = true;

            clearInterval(this.timerMove);
            this.timersManager.clear();
            this.timersManager = new Map<string, Timer>();
            this.timerMove = null;
        });
        document.body.addEventListener("snakeRunning", (e: CustomEvent) => {
            var mainClass: SnakeGame<{}> = e.detail.main;
            if(!this.isGameStart || this.isRunning || !this.isAbleToRun) return;
            this.isRunning = true;
            this.isAbleToRun = false;

            this.setSpeed(185);

            var timeLeft = 10; // seconds
            mainClass.setState({
                tipMessage: "You're running. (Time Left: "+ timeLeft +"s)"
            });
            var timer = setInterval(() => {
                timeLeft--;
                mainClass.setState({
                    tipMessage: "You're running. (Time Left: "+ timeLeft +"s)"
                });

                if(timeLeft == 0) {
                    this.isRunning = false;
                    mainClass.setState({
                        tipMessage: ""
                    });
                    this.setSpeed(150);
                    clearInterval(this.timersManager.get("runningAbility")?.timer);
                    this.timersManager.delete("runningAbility");

                    timeLeft = 10;
                }
            }, 1000);
            this.timersManager.set("runningAbility", {timer: timer, type: "interval"});

            var cdTimer = setTimeout(() => {
                this.isAbleToRun = true;
                mainClass.setState({
                    tipMessage: tipMessageRunning
                });
            }, 30 * 1000);
            this.timersManager.set("runningCooldown", {timer: cdTimer, type: "timeout"});
        });
    }
}

interface GameState {
    
}

interface Timer {
    timer: any
    type: "interval" | "timeout"
}
