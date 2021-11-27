/* eslint-disable eqeqeq */
import Game from "../components/Game";
import { Towards } from "../components/Towards";
import Position from "../objects/Position";
import AI from "./AI";

import textureLeft from "../style/textures/ghost_left.png";
import textureRight from "../style/textures/ghost_right.png";

/**
 * When the snake meet it, it will eat the snake and then game over.
 */
export default class Ghost {
    private position: Position;
    private game: Game<{}>;
    private ai: AI.GhostAI;

    public toward: Towards = Towards.RIGHT;

    public width: number = 10;
    public height: number = 10;

    public constructor(position: Position, game: Game<{}>) {
        this.position = position;
        this.game = game;

        this.ai = new AI.GhostAI(this.game, this);
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

        var ghostElem = document.getElementsByClassName("ghost")[0] as HTMLDivElement;
        if(!ghostElem) return;

        ghostElem.style.left = this.width * newPosition.x +"px";
        ghostElem.style.top = this.height * newPosition.y +"px";
    }

    public setToward(toward: Towards): void {
        this.toward = toward;
        
        var ghostElem = document.getElementsByClassName("ghost")[0] as HTMLDivElement;
        if(!ghostElem) return;

        ghostElem.style.backgroundImage = toward == Towards.LEFT ? textureLeft : textureRight;
    }

    public remove(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        gameContainer.removeChild(gameContainer.getElementsByClassName("ghost")[0]);
    }

    public spawn(): void {
        var gameContainer = document.getElementById("game");
        if(!gameContainer) return;

        var ghostElem = document.createElement("div");
        ghostElem.className = "ghost";
        ghostElem.style.left = this.width * this.position.x +"px";
        ghostElem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(ghostElem);
    }
}
