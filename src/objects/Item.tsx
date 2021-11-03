import Game from "../components/Game";
import FoodPosition from "./FoodPosition";

export default class Item {
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
