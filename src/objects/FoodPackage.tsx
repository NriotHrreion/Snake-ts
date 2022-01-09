import Game from "../components/Game";
import Item from "./Item";
import Position from "./Position";

/**
 * When the snake eat it, the snake will got 5 score.
 */
export default class Food extends Item {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "food-package");
    }

    public eat(): void {
        super.eat();

        this.game.score += 5;

        if(this.game.itemsManager.get("bomb") != null) {
            this.game.itemsManager.get("bomb")?.remove();
            this.game.itemsManager.set("bomb", null);
        }

        if(this.game.itemsManager.get("candy") != null) {
            this.game.itemsManager.get("candy")?.remove();
            this.game.itemsManager.set("candy", null);
        }

        if(this.game.itemsManager.get("snickers") != null) {
            this.game.itemsManager.get("snickers")?.remove();
            this.game.itemsManager.set("snickers", null);
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}
