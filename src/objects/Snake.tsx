/* eslint-disable eqeqeq */
import { Dir } from "../components/Dir";
import Game from "../components/Game";
import Food from "./Food";
import Bomb from "./Bomb";
import Candy from "./Candy";
import Snickers from "./Snickers";
import Utils from "../utils";

export default class Snake {
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

    public getHeadPosition(): {x: number, y: number} {
        return {
            x: this.body[this.body.length - 1].x,
            y: this.body[this.body.length - 1].y
        };
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

            // do spawn food (100%)
            this.game.food = new Food({
                x: Utils.getRandom(0, 79),
                y: Utils.getRandom(0, 49)
            }, this.game);
            this.game.food.display();

            // do spawn bomb (50%)
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

            // do spawn snickers (20%)
            if(Utils.getRandom(0, 4) == 0) {
                this.game.snickers = new Snickers({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game);
                this.game.snickers.display();
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

        // check whether it ate a candy
        if(
            this.game.candy &&
            this.body[this.body.length - 1].x == this.game.candy.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.candy.getPosition().y
        ) {
            this.game.candy.eat();
            this.game.candy = null;
        }

        // check whether it ate the snickers
        if(
            this.game.snickers &&
            this.body[this.body.length - 1].x == this.game.snickers.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.snickers.getPosition().y
        ) {
            this.game.snickers.eat();
            this.game.snickers = null;
        }
    }
}

interface SnakeBody {
    id: number
    x: number
    y: number
}
