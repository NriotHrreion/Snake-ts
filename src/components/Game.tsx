/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Dir } from "./Dir";
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

class Snake {
    private game: Game<{}>;

    private direction: Dir = Dir.RIGHT;
    private length: number;
    private body: SnakeBody[] = [];

    private width: number = 10;
    private height: number = 10;

    public constructor(initialLength: number, game: Game<{}>) {
        this.game = game;
        this.length = initialLength;
    }

    public init(): void {
        for(var i = 0; i < this.length; i++) {
            this.body.push({id: i, x: i, y: 0});
        }

        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;
        gameContainer.innerHTML = "";
        
        for(let j of this.body) {
            var bodyElem = document.createElement("div");
            bodyElem.className = "snake-body";
            bodyElem.style.left = this.width * j.x +"px";
            bodyElem.style.top = this.height * j.y +"px";
            gameContainer.appendChild(bodyElem);
        }
    }

    public addLength(): void {
        this.length++;
        var x = this.body[0].x, y = this.body[0].y;

        switch(this.direction) {
            case Dir.UP:
                y++;
                break;
            case Dir.DOWN:
                y--;
                break;
            case Dir.LEFT:
                x++;
                break;
            case Dir.RIGHT:
                x--;
                break;
        }

        this.body.unshift({
            id: this.length,
            x: x,
            y: y
        });

        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var tailElem = document.createElement("div");
        tailElem.className = "snake-body";
        tailElem.style.left = this.width * x +"px";
        tailElem.style.top = this.height * y +"px";
        gameContainer.appendChild(tailElem);
    }

    public getLength(): number {
        return this.length;
    }

    public setDirection(direction: Dir): void {
        this.direction = direction;
    }

    public getDirection(): Dir {
        return this.direction;
    }

    public move(): void {
        if(!this.game.isGameStart) return;

        // check whether it ate itself
        for(let r in this.body) {
            if(Number(r) == this.body.length - 1) continue;

            if(
                this.body[r].x == this.body[this.body.length - 1].x &&
                this.body[r].y == this.body[this.body.length - 1].y
            ) {
                this.game.stop();
            }
        }

        // move body
        for(let q = 0; q < this.body.length; q++) {
            if(q != this.body.length - 1) {
                this.body[q].x = this.body[q + 1].x;
                this.body[q].y = this.body[q + 1].y;
            }
        }

        // move head & check whether it hit the wall
        var i = this.body.length - 1;
        switch(this.direction) {
            case Dir.UP:
                this.body[i].y--;
                if(this.body[i].y < 0) {
                    if(this.game.throughWall) {
                        this.body[i].y = 49;
                    } else {
                        this.body[i].y++;
                        this.game.stop();
                        return;
                    }
                }
                break;
            case Dir.DOWN:
                this.body[i].y++;
                if(this.body[i].y > 49) {
                    if(this.game.throughWall) {
                        this.body[i].y = 0;
                    } else {
                        this.body[i].y--;
                        this.game.stop();
                        return;
                    }
                }
                break;
            case Dir.LEFT:
                this.body[i].x--;
                if(this.body[i].x < 0) {
                    if(this.game.throughWall) {
                        this.body[i].x = 79;
                    } else {
                        this.body[i].x++;
                        this.game.stop();
                        return;
                    }
                }
                break;
            case Dir.RIGHT:
                this.body[i].x++;
                if(this.body[i].x > 79) {
                    if(this.game.throughWall) {
                        this.body[i].x = 0;
                    } else {
                        this.body[i].x--;
                        this.game.stop();
                        return;
                    }
                }
                break;
        }

        // display the snake
        var bodyElems = document.getElementsByClassName("snake-body") as HTMLCollectionOf<HTMLElement>;
        for(var j = bodyElems.length - 1; j >= 0; j--) {
            bodyElems[j].style.left = this.width * this.body[j].x +"px";
            bodyElems[j].style.top = this.height * this.body[j].y +"px";
        }

        // check whether it ate the food
        if(
            this.body[this.body.length - 1].x == this.game.food.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.food.getPosition().y
        ) {
            this.game.food.eat();

            this.game.food = new Food({
                x: Utils.getRandom(0, 79),
                y: Utils.getRandom(0, 49)
            }, this.game);
            this.game.food.display();

            // do spawn bomb
            if(Utils.getRandom(0, 1) == 0) {
                this.game.bomb = new Bomb({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game);
                this.game.bomb.display();
            }

            // do spawn candy (33%)
            if(Utils.getRandom(0, 2) == 0) {
                this.game.candy = new Candy({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game);
                this.game.candy.display();
            }

            this.addLength();
        }

        // check whether it ate the bomb
        if(
            this.game.bomb &&
            this.body[this.body.length - 1].x == this.game.bomb.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.bomb.getPosition().y &&
            !this.game.doIgnoreBomb
        ) {
            this.game.bomb.boom();
            this.game.bomb = null;
        }

        if(
            this.game.candy &&
            this.body[this.body.length - 1].x == this.game.candy.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.candy.getPosition().y
        ) {
            this.game.candy.eat();
            this.game.candy = null;
        }
    }
}

class Item {
    public position: FoodPosition;
    public game: Game<{}>;
    public className: string;
    
    public width: number = 10;
    public height: number = 10;

    public constructor(position: FoodPosition, game: Game<{}>, className: string) {
        this.position = position;
        this.game = game;
        this.className = className;
    }

    public getPosition(): FoodPosition {
        return this.position;
    }

    public eat(): void {
        this.remove();
    }

    public remove(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        gameContainer.removeChild(gameContainer.getElementsByClassName(this.className)[0]);
    }

    public display(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var bombElem = document.createElement("div");
        bombElem.className = this.className;
        bombElem.style.left = this.width * this.position.x +"px";
        bombElem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(bombElem);
    }
}

/**
 * When the snake eat it, the snake will got 1 score.
 */
class Food extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "food");
    }

    public eat(): void {
        super.eat();

        this.game.score++;

        if(this.game.bomb != null) {
            this.game.bomb.remove();
            this.game.bomb = null;
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}

/**
 * When the snake eat it, the snake will lose 5 scores.
 */
class Bomb extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "bomb");
    }

    public boom(): void {
        super.eat();

        if(this.game.score - 5 < 0) {
            this.game.stop();
            return;
        }
        this.game.score -= 5;
        
        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}

/**
 * When the snake eat it, the snake can move faster for 5 seconds.
 */
class Candy extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "candy");
    }

    public eat(): void {
        super.eat();

        // add speed
        this.game.setSpeed(this.game.speed + 30);
        // set the speed to 150 after 5 seconds (5000ms)
        setTimeout(() => {
            this.game.setSpeed(150);
        }, 5000);
    }
}

/**
 * When the snake eat it, the snake will be able to ignore the bomb for 10 seconds.
 * 
 * @todo
 */
class Snickers extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "snickers");
    }

    public eat(): void {
        super.eat();

        // ignore bomb
        this.game.doIgnoreBomb = true;
        // set it to the normal value after 10 seconds (10000ms)
        setTimeout(() => {
            this.game.doIgnoreBomb = false;
        }, 10000);
    }
}

interface SnakeBody {
    id: number
    x: number
    y: number
}

interface FoodPosition {
    x: number
    y: number
}

interface GameState {

}
