import Game from "../components/Game";
import Item from "./Item";
import FoodPosition from "./FoodPosition";

/**
 * When the snake eat it, the snake will lose 5 scores.
 */
export default class Bomb extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
        super(position, game, "bomb");
    }

    public boom(): void {
        super.eat();

        if(this.game.score - 5 < 0) {
            this.game.stop();
            return;
        }
        this.game.score -= 5;
        
        var getScoreEvent = new CustomEvent("getScore", {detail: {
            score: this.game.score
        }});
        document.body.dispatchEvent(getScoreEvent);
    }
}
