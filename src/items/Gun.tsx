/* eslint-disable eqeqeq */
import Item from "./Item";
import Game from "../components/Game";
import Shop from "../shop/Shop";
import { Dir } from "../components/Dir";

export default class Gun extends Item {
    public constructor(itemId: number, icon: string, stackable: boolean) {
        super(itemId, "Gun", icon, stackable);
    }
    
    public onUse(game: Game<{}>): void {
        super.onUse(game);

        var direction = game.snake.getDirection();
        var itemSlots = Shop.get().getInventory().itemSlots;
        var bulletSlot;

        for(let i = 0; i < itemSlots.length; i++) {
            if(itemSlots[i].itemId == 2) {
                bulletSlot = itemSlots[i].slotId;
            }
        }

        // Lose a bullet. If there is no bullets, return.
        if(bulletSlot != undefined) {
            var inv = Shop.get().getInventory();
            inv.itemSlots[bulletSlot].amount--;
            Shop.get().setInventory(inv);
        } else {
            return;
        }

        var ghost_a = game.ghost, ghost_b = game.ghostGray; // ghost_a = ghost; ghost_b = ghostGray
        var ax, ay, bx, by;
        if(ghost_a) {
            ax = ghost_a.getPosition().x; 
            ay = ghost_a.getPosition().y;
        }
        if(ghost_b) {
            bx = ghost_b.getPosition().x;
            by = ghost_b.getPosition().y;
        }

        var sx = game.snake.getHeadPosition().x, sy = game.snake.getHeadPosition().y;

        switch(direction) {
            case Dir.UP:
                if(ghost_a && ay && ax == sx && ay < sy) {
                    ghost_a.remove();
                    game.ghost = null;
                } else if(ghost_b && by && bx == sx && by < sy) {
                    ghost_b.remove();
                    game.ghostGray = null;
                }
                break;
            case Dir.DOWN:
                if(ghost_a && ay && ax == sx && ay > sy) {
                    ghost_a.remove();
                    game.ghost = null;
                } else if(ghost_b && by && bx == sx && by > sy) {
                    ghost_b.remove();
                    game.ghostGray = null;
                }
                break;
            case Dir.LEFT:
                if(ghost_a && ax && ax < sx && ay == sy) {
                    ghost_a.remove();
                    game.ghost = null;
                } else if(ghost_b && bx && bx < sx && by == sy) {
                    ghost_b.remove();
                    game.ghostGray = null;
                }
                break;
            case Dir.RIGHT:
                if(ghost_a && ax && ax > sx && ay == sy) {
                    ghost_a.remove();
                    game.ghost = null;
                } else if(ghost_b && bx && bx > sx && by == sy) {
                    ghost_b.remove();
                    game.ghostGray = null;
                }
                break;
        }
    }
}
