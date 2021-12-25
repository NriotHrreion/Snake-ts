import Game from "../components/Game";
import Position from "./Position";

export default class Item {
    public position: Position;
    public game: Game<{}>;
    public className: string;
    
    public width: number = 10;
    public height: number = 10;

    public constructor(position: Position, game: Game<{}>, className: string) {
        this.position = position;
        this.game = game;
        this.className = className;
    }

    public getPosition(): Position {
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

        var elem = document.createElement("div");
        elem.className = this.className;
        elem.style.left = this.width * this.position.x +"px";
        elem.style.top = this.height * this.position.y +"px";
        gameContainer.appendChild(elem);
    }
}
