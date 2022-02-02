import { CommodityType } from "shop/Commodities";
import Game from "../components/Game";

export default class Item {
    public itemId: number
    public name: string;
    public icon: string;
    public type: CommodityType = CommodityType.ITEM;
    public stackable: boolean = true;

    public constructor(itemId: number, name: string, icon: string, stackable: boolean) {
        this.itemId = itemId;
        this.name = name;
        this.icon = icon;
        this.stackable = stackable;
    }

    public onUse(game: Game<{}>): void {
        
    }
}
