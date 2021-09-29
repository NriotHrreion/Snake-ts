/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Dir } from "./Dir";
import Utils from "../utils";

export default class Game<P> extends Component<{}, GameState> {
    private snake: Snake;
    public food: Food;
    public bomb: Bomb | null;

    public isGameStart: boolean = false;
    public score: number = 0;

    private timerMove: any;
    
    public constructor(props: P) {
        super(props);

        this.state = {};
        this.snake = new Snake(3, this);
        this.food = new Food({
            x: Utils.getRandom(0, 79),
            y: Utils.getRandom(0, 49)
        }, this);
        this.bomb = null;
    }

    private start(): void {
        this.isGameStart = true;

        this.timerMove = setInterval(() => {
            this.snake.move();
        }, 150);
    }

    public stop(): void {
        alert("You Died\nBe more carefully next time...");
        clearInterval(this.timerMove);

        var gameStopEvent = new CustomEvent("gameStop");
        document.body.dispatchEvent(gameStopEvent);
    }

    public render(): ReactElement {
        return (
            <div className="game-container" id="game"></div>
        );
    }

    public componentDidMount(): void {
        this.snake.init();
        this.food.display();

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
                    // this.snake.move();
                    break;
                case "ArrowDown":
                    if(this.snake.getDirection() == Dir.UP || !this.isGameStart) return;
                    this.snake.setDirection(Dir.DOWN);
                    // this.snake.move();
                    break;
                case "ArrowLeft":
                    if(this.snake.getDirection() == Dir.RIGHT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.LEFT);
                    // this.snake.move();
                    break;
                case "ArrowRight":
                    if(this.snake.getDirection() == Dir.LEFT || !this.isGameStart) return;
                    this.snake.setDirection(Dir.RIGHT);
                    // this.snake.move();
                    break;
            }
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
                    this.body[i].y++;
                    this.game.stop();
                    return;
                }
                break;
            case Dir.DOWN:
                this.body[i].y++;
                if(this.body[i].y > 49) {
                    this.body[i].y--;
                    this.game.stop();
                    return;
                }
                break;
            case Dir.LEFT:
                this.body[i].x--;
                if(this.body[i].x < 0) {
                    this.body[i].x++;
                    this.game.stop();
                    return;
                }
                break;
            case Dir.RIGHT:
                this.body[i].x++;
                if(this.body[i].x > 79) {
                    this.body[i].x--;
                    this.game.stop();
                    return;
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
            var choose = Utils.getRandom(0, 1); // 0 no, 1 yes
            if(choose == 1) {
                this.game.bomb = new Bomb({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game);
                this.game.bomb.display();

                // setTimeout(() => {
                //     if(!this.game.bomb) return
                //     this.game.bomb.boom();
                //     this.game.bomb = null;
                // }, 10000);
            }

            this.addLength();
        }

        // check whether it ate the bomb
        if(
            this.game.bomb &&
            this.body[this.body.length - 1].x == this.game.bomb.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.bomb.getPosition().y
        ) {
            this.game.bomb.boom();
            this.game.bomb = null;
        }
    }
}

class Food {
    private position: FoodPosition;
    private game: Game<{}>
    
    private width: number = 10;
    private height: number = 10;

    public constructor(position: FoodPosition, game: Game<{}>) {
        this.position = position;
        this.game = game;
    }

    public getPosition(): FoodPosition {
        return this.position;
    }

    public eat(): void {
        this.game.score++;

        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        gameContainer.removeChild(gameContainer.getElementsByClassName("food")[0]);
        if(this.game.bomb != null) {
            this.game.bomb.remove();
            this.game.bomb = null;
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }

    public display(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var foodElem = document.createElement("div");
        foodElem.className = "food";
        foodElem.style.left = this.width * this.position.x +"px";
        foodElem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(foodElem);
    }
}

class Bomb {
    private position: FoodPosition;
    private game: Game<{}>
    
    private width: number = 10;
    private height: number = 10;

    public constructor(position: FoodPosition, game: Game<{}>) {
        this.position = position;
        this.game = game;
    }

    public getPosition(): FoodPosition {
        return this.position;
    }

    public boom(): void {
        if(this.game.score - 5 < 0) {
            this.remove();
            this.game.stop();
            return;
        }
        this.game.score -= 5;

        this.remove();
        
        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }

    public remove(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        gameContainer.removeChild(gameContainer.getElementsByClassName("bomb")[0]);
    }

    public display(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var bombElem = document.createElement("div");
        bombElem.className = "bomb";
        bombElem.style.left = this.width * this.position.x +"px";
        bombElem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(bombElem);
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
