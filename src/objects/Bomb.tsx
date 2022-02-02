import Game from "../components/Game";
import Block from "./Block";
import Position from "./Position";

/**
 * When the snake eat it, the snake will lose 5 scores.
 */
export default class Bomb extends Block {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "bomb");
    }

    public eat(): void {
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
