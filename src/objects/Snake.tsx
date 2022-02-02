/* eslint-disable eqeqeq */
import { Dir } from "../components/Dir";
import Game from "../components/Game";
import { Blocks } from "../objects/Blocks";
import Ghost from "../entities/Ghost";
import GhostGray from "../entities/GhostGray";
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
        var zeroPoint = this.game.generateWall ? 1 : 0;

        for(var i = zeroPoint; i < this.length + zeroPoint; i++) {
            this.body.push({id: i, x: i, y: zeroPoint});
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
            this.body[this.body.length - 1].x == this.game.blocksManager.get("food")?.getPosition().x &&
            this.body[this.body.length - 1].y == this.game.blocksManager.get("food")?.getPosition().y
        ) {
            this.game.blocksManager.get("food")?.eat();

            // reset the ghost
            if(this.game.ghost) {
                this.game.ghost.remove();
                this.game.ghost = null;
            }

            // reset the ghost gray
            if(this.game.ghostGray) {
                this.game.ghostGray.remove();
                this.game.ghostGray = null;
            }

            var foodBorder = this.game.generateWall ? 1 : 0;

            // do spawn food (100%)
            this.game.blocksManager.set("food", new Blocks.Food({
                x: Utils.getRandom(0 + foodBorder, 79 - foodBorder),
                y: Utils.getRandom(0 + foodBorder, 49 - foodBorder)
            }, this.game));
            this.game.blocksManager.get("food")?.display();

            // do spawn food package (5%)
            if(Utils.getRandom(0, 19) == 0) {
                this.game.blocksManager.set("food-package", new Blocks.FoodPackage({
                    x: Utils.getRandom(0 + foodBorder, 79 - foodBorder),
                    y: Utils.getRandom(0 + foodBorder, 49 - foodBorder)
                }, this.game));
                this.game.blocksManager.get("food-package")?.display();
            }

            // do spawn bomb (50%)
            if(Utils.getRandom(0, 1) == 0) {
                this.game.blocksManager.set("bomb", new Blocks.Bomb({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game));
                this.game.blocksManager.get("bomb")?.display();
            }

            // do spawn candy (33%)
            if(Utils.getRandom(0, 2) == 0) {
                this.game.blocksManager.set("candy", new Blocks.Candy({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game));
                this.game.blocksManager.get("candy")?.display();
            }

            // do spawn snickers (20%)
            if(Utils.getRandom(0, 4) == 0) {
                this.game.blocksManager.set("snickers", new Blocks.Snickers({
                    x: Utils.getRandom(0, 79),
                    y: Utils.getRandom(0, 49)
                }, this.game));
                this.game.blocksManager.get("snickers")?.display();
            }

            // do spawn ghost (10%)
            if(Utils.getRandom(0, 9) == 0) {
                this.game.ghost = new Ghost({x: 0, y: 0}, this.game);
                this.game.ghost.spawn();
            }

            // do spawn ghost gray (20%)
            if(Utils.getRandom(0, 4) == 0) {
                this.game.ghostGray = new GhostGray({x: 79, y: 0}, this.game);
                this.game.ghostGray.spawn();
            }

            this.addLength();
        }

        var headNode = this.body.length - 1;

        // check whether it ate the food package
        if(
            this.game.blocksManager.get("food-package") &&
            this.body[headNode].x == this.game.blocksManager.get("food-package")?.getPosition().x &&
            this.body[headNode].y == this.game.blocksManager.get("food-package")?.getPosition().y
        ) {
            this.game.blocksManager.get("food-package")?.eat();
            this.game.blocksManager.set("food-package", null);
        }

        // check whether it ate the bomb
        if(
            this.game.blocksManager.get("bomb") &&
            this.body[headNode].x == this.game.blocksManager.get("bomb")?.getPosition().x &&
            this.body[headNode].y == this.game.blocksManager.get("bomb")?.getPosition().y &&
            !this.game.doIgnoreBomb
        ) {
            this.game.blocksManager.get("bomb")?.eat();
            this.game.blocksManager.set("bomb", null);
        }

        // check whether it ate a candy
        if(
            this.game.blocksManager.get("candy") &&
            this.body[headNode].x == this.game.blocksManager.get("candy")?.getPosition().x &&
            this.body[headNode].y == this.game.blocksManager.get("candy")?.getPosition().y
        ) {
            this.game.blocksManager.get("candy")?.eat();
            this.game.blocksManager.set("candy", null);
        }

        // check whether it ate the snickers
        if(
            this.game.blocksManager.get("snickers") &&
            this.body[headNode].x == this.game.blocksManager.get("snickers")?.getPosition().x &&
            this.body[headNode].y == this.game.blocksManager.get("snickers")?.getPosition().y
        ) {
            this.game.blocksManager.get("snickers")?.eat();
            this.game.blocksManager.set("snickers", null);
        }

        // check whether it has been eaten by the ghost
        if(
            this.game.ghost &&
            this.body[headNode].x == this.game.ghost.getPosition().x &&
            this.body[headNode].y == this.game.ghost.getPosition().y
        ) {
            this.game.ghost.remove();
            this.game.ghost = null;

            this.game.stop();
        }

        // check whether it has been eaten by the ghost gray
        if(
            this.game.ghostGray &&
            this.body[headNode].x == this.game.ghostGray.getPosition().x &&
            this.body[headNode].y == this.game.ghostGray.getPosition().y
        ) {
            this.game.ghostGray.remove();
            this.game.ghostGray = null;

            this.game.stop();
        }

        // check whether it hit the wall
        if(this.game.generateWall) {
            var x = this.body[headNode].x, y = this.body[headNode].y;
            var wallElem = document.getElementById("wall-"+ x +"-"+ y);
            if(wallElem && wallElem.className == "wall") {
                this.game.stop();
            }
        }

        var snakeMoveEvent = new CustomEvent("snakeMove");
        document.body.dispatchEvent(snakeMoveEvent);
    }
}

interface SnakeBody {
    id: number
    x: number
    y: number
}
