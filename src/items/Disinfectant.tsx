/* eslint-disable eqeqeq */
import Item from "./Item";
import Game from "../components/Game";
import Shop from "../shop/Shop";

export default class Disinfectant extends Item {
    public constructor(itemId: number, icon: string, stackable: boolean) {
        super(itemId, "84 Disinfectant", icon, stackable);
    }
    
    public onUse(game: Game<{}>): void {
        super.onUse(game);

        var itemSlots = Shop.get().getInventory().itemSlots;
        var disinfectantSlot;

        for(let i = 0; i < itemSlots.length; i++) {
            if(itemSlots[i].itemId == 3) {
                disinfectantSlot = itemSlots[i].slotId;
            }
        }

        // Lose a 84 disinfectant. If there is no disinfectant, return.
        if(disinfectantSlot != undefined) {
            var inv = Shop.get().getInventory();
            inv.itemSlots[disinfectantSlot].amount--;
            Shop.get().setInventory(inv);
        } else {
            return;
        }

        var ghost_a = game.ghost, ghost_b = game.ghostGray; // ghost_a = ghost; ghost_b = ghostGray
        if(ghost_a) {
            ghost_a.remove();
            game.ghost = null;
        }
        if(ghost_b) {
            ghost_b.remove();
            game.ghostGray = null;
        }
    }
}
