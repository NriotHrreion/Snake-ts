import Item from "./Item";
import Game from "../components/Game";

export default class Bullet extends Item {
    public constructor(itemId: number, icon: string, stackable: boolean) {
        super(itemId, "Bullet", icon, stackable);
    }
    
    public onUse(game: Game<{}>): void {
        super.onUse(game);
    }
}
