/* eslint-disable eqeqeq */
import Game from "../components/Game";
import { Towards } from "../components/Towards";
import Position from "../objects/Position";
import AI from "./AI";
import Utils from "../utils";
import { Dir } from "../components/Dir";

import textureLeft from "../style/textures/ghost_gray_left.png";
import textureRight from "../style/textures/ghost_gray_right.png";

/**
 * When the snake meet it, it will eat the snake and then game over.
 */
export default class GhostGray {
    private position: Position;
    private game: Game<{}>;
    private ai: GhostGrayAI;

    public toward: Towards = Towards.RIGHT;

    public width: number = 10;
    public height: number = 10;

    public constructor(position: Position, game: Game<{}>) {
        this.position = position;
        this.game = game;

        this.ai = new GhostGrayAI(this.game, this);
    }

    public getPosition(): Position {
        return this.position;
    }

    public setPosition(newPosition: Position): void {
        // Let the ghost be able to through wall
        // So that it can move easilier
        if(newPosition.y < 0) newPosition.y = 49;
        if(newPosition.y > 49) newPosition.y = 0;
        if(newPosition.x < 0) newPosition.x = 79;
        if(newPosition.x > 79) newPosition.x = 0;
        
        this.position = newPosition;

        var ghostElem = document.getElementsByClassName("ghost-gray")[0] as HTMLDivElement;
        if(!ghostElem) return;

        ghostElem.style.left = this.width * newPosition.x +"px";
        ghostElem.style.top = this.height * newPosition.y +"px";
    }

    public setToward(toward: Towards): void {
        this.toward = toward;
        
        var ghostElem = document.getElementsByClassName("ghost-gray")[0] as HTMLDivElement;
        if(!ghostElem) return;

        ghostElem.style.backgroundImage = toward == Towards.LEFT ? textureLeft : textureRight;
    }

    public remove(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        gameContainer.removeChild(gameContainer.getElementsByClassName("ghost-gray")[0]);
        this.ai.clearCycle();
    }

    public spawn(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var ghostElem = document.createElement("div");
        ghostElem.className = "ghost-gray";
        ghostElem.style.left = this.width * this.position.x +"px";
        ghostElem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(ghostElem);
    }
}

class GhostGrayAI extends AI<GhostGray> {
    public constructor(game: Game<{}>, self: GhostGray) {
        super(game, self);
    }

    public cycle(): void {
        super.cycle();
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

    public onMove(): void {
        super.onMove();
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
}
