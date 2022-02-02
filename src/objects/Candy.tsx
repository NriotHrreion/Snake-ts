import Game from "../components/Game";
import Block from "./Block";
import Position from "./Position";

/**
 * When the snake eat it, the snake can move faster for 5 seconds.
 */
export default class Candy extends Block {
    public constructor(position: Position, game: Game<{}>) {
        super(position, game, "candy");
    }

    public eat(): void {
        super.eat();

        // add speed
        this.game.setSpeed(195);
        // set the speed to 150 after 5 seconds (5000ms)
        setTimeout(() => {
            this.game.setSpeed(150);
        }, 5 * 1000);
    }
}
