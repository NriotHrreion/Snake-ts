import Game from "../components/Game";
import Item from "./Item";
import FoodPosition from "./FoodPosition";

/**
 * When the snake eat it, the snake will got 1 score.
 */
export default class Food extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "food");
    }

    public eat(): void {
        super.eat();

        this.game.score++;

        if(this.game.bomb != null) {
            this.game.bomb.remove();
            this.game.bomb = null;
        }

        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}
