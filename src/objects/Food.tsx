import Game from "../components/Game";
import Item from "./Item";
import Position from "./Position";

/**
 * When the snake eat it, the snake will got 1 score.
 */
export default class Food extends Item {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "food");
    }

    public eat(): void {
        super.eat();

        this.game.score++;

        if(this.game.bomb != null) {
            this.game.bomb.remove();
            this.game.bomb = null;
        }

        if(this.game.candy != null) {
            this.game.candy.remove();
            this.game.candy = null;
        }

        if(this.game.snickers != null) {
            this.game.snickers.remove();
            this.game.snickers = null;
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}
