import Game from "../components/Game";
import Block from "./Block";
import Position from "./Position";

/**
 * When the snake eat it, the snake will got 5 score.
 */
export default class Food extends Block {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "food-package");
    }

    public eat(): void {
        super.eat();

        this.game.score += 5;

        if(this.game.blocksManager.get("bomb") != null) {
            this.game.blocksManager.get("bomb")?.remove();
            this.game.blocksManager.set("bomb", null);
        }

        if(this.game.blocksManager.get("candy") != null) {
            this.game.blocksManager.get("candy")?.remove();
            this.game.blocksManager.set("candy", null);
        }

        if(this.game.blocksManager.get("snickers") != null) {
            this.game.blocksManager.get("snickers")?.remove();
            this.game.blocksManager.set("snickers", null);
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}
