import gun from "./icons/gun.png";
import lessBullets from "./icons/less_bullets.png";
import moreBullets from "./icons/more_bullets.png";
import disinfectant from "./icons/disinfectant.png";

export interface Commodity {
    id: number // Commodity id
    itemId: number // Item id
    name: string // Commodity name
    itemName: string // Item name
    description: string // Commodity description
    icon: string // Commodity icon (display in the shop)
    itemIcon: string // Item icon (display in the inventory)
    price: number
    type: CommodityType
    amount: number
    stackable: boolean // The item can be stacked or not
}

export enum CommodityType {
    ITEM = "Item", EFFECT = "Effect", ARMOR = "Armor"
}

const commodities: Commodity[] = [
    {
        id: 1,
        itemId: 1,
        name: "Gun",
        itemName: "Gun",
        description: "The gun is used for shooting the ghosts and you can use it to protect yourself. It's very suitable for you to buy it!",
        icon: gun,
        itemIcon: gun,
        price: 10,
        type: CommodityType.ITEM,
        amount: 1,
        stackable: false
    },
    {
        id: 2,
        itemId: 2,
        name: "10 Bullets",
        itemName: "Bullet",
        description: "Without bullets, you're not able to use your gun. Here are 10 bullets.<br>If you want more, you can buy the another commodity '50 Bullets'.",
        icon: lessBullets,
        itemIcon: lessBullets,
        price: 7,
        type: CommodityType.ITEM,
        amount: 10,
        stackable: true
    },
    {
        id: 3,
        itemId: 2,
        name: "50 Bullets",
        itemName: "Bullet",
        description: "Without bullets, you're not able to use your gun. Here are 50 bullets.",
        icon: moreBullets,
        itemIcon: lessBullets,
        price: 30,
        type: CommodityType.ITEM,
        amount: 50,
        stackable: true
    },
    {
        id: 4,
        itemId: 3,
        name: "84 Disinfectant",
        itemName: "84 Disinfectant",
        description: "The 84 Disinfectant can clear the ghosts in just a second.<br>We use it to kill virus in the real life, and the snake use it to kill ghosts in the game.",
        icon: disinfectant,
        itemIcon: disinfectant,
        price: 150,
        type: CommodityType.ITEM,
        amount: 1,
        stackable: true
    }
];

export default commodities;
