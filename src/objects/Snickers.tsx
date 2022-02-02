import Game from "../components/Game";
import Block from "./Block";
import Position from "./Position";

/**
 * When the snake eat it, the snake will be able to ignore the bomb for 10 seconds.
 * 
 * @todo
 */
export default class Snickers extends Block {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "snickers");
    }

    public eat(): void {
        super.eat();

        // ignore bomb
        this.game.doIgnoreBomb = true;
        // set it to the normal value after 10 seconds (10000ms)
        setTimeout(() => {
            this.game.doIgnoreBomb = false;
        }, 10 * 1000);
    }
}
