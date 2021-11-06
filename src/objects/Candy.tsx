import Game from "../components/Game";
import Item from "./Item";
import FoodPosition from "./FoodPosition";

/**
 * When the snake eat it, the snake can move faster for 5 seconds.
 */
export default class Candy extends Item {
    public constructor(position: FoodPosition, game: Game<{}>) {
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
