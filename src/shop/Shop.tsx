/* eslint-disable eqeqeq */
import XXTEA from "xxtea-node";
import commodities, { Commodity, CommodityType } from "./Commodities";
import Inventory from "./Inventory";
import Item from "../items/Item";
import Gun from "../items/Gun";
import Bullet from "../items/Bullet";
import Disinfectant from "../items/Disinfectant";
import Utils from "../utils";

const xxteaKey: Uint8Array = XXTEA.toBytes("a1b2c3d4ex");

export default class Shop {
    private static instance: Shop | null = null;

    public wallet: number = 0;

    private Shop() {
        
    }

    public static get(): Shop {
        if(Shop.instance == null) {
            Shop.instance = new Shop();
        }
        return Shop.instance;
    }

    public buyCommodity(id: number): void {
        var commodity = this.getCommodity(id);
        if(!commodity) return;

        var amount = commodity.amount;
        var price = commodity.price;
        var wallet = this.getWallet();
        if(price <= wallet) {
            var slotType: "itemSlots" | "armorSlots";
            switch(commodity.type) {
                case CommodityType.ITEM:
                    slotType = "itemSlots";
                    break;
                case CommodityType.EFFECT:
                    slotType = "itemSlots";
                    break;
                case CommodityType.ARMOR:
                    slotType = "armorSlots";
                    break;
            }

            this.setWallet(wallet - price);
            this.giveCommodity(commodity.itemId, amount, slotType);

            alert("The commodity has gone to your inventory!\n(Paid: "+ price +")");
        } else {
            alert("You aren't able to afford this commodity.\nGo and play the game to earn more money!");
        }
    }

    public setWallet(money: number): void {
        this.storeData("snake-ts.wallet", money.toString());
    }

    public getWallet(): number {
        var data = this.fetchData("snake-ts.wallet");
        if(data == null) {
            this.storeData("snake-ts.wallet", "0"); // DEBUG
            return this.getWallet();
        }

        return parseInt(data);
    }

    public setInventory(inventory: Inventory): void {
        this.storeData("snake-ts.inventory", JSON.stringify(inventory));
    }

    public getInventory(): Inventory {
        var data = this.fetchData("snake-ts.inventory");
        if(data == null) {
            this.storeData("snake-ts.inventory", JSON.stringify({armorSlots: [], itemSlots: []}));
            return this.getInventory();
        }

        return JSON.parse(data);
    }

    // `return commodities[id - 1];` is not suitable here
    public getCommodity(id: number): Commodity | null {
        for(let i = 0; i < commodities.length; i++) {
            if(commodities[i].id == id) {
                return commodities[i];
            }
        }
        return null;
    }

    public getItem(itemId: number): Item | null {
        for(let i = 0; i < commodities.length; i++) {
            if(commodities[i].itemId == itemId) {
                var c = commodities[i];
                switch(itemId) {
                    case 1:
                        return new Gun(c.itemId, c.itemIcon, c.stackable);
                    case 2:
                        return new Bullet(c.itemId, c.itemIcon, c.stackable);
                    case 3:
                        return new Disinfectant(c.itemId, c.itemIcon, c.stackable);
                }
            }
        }
        return null;
    }

    // Give the player a commodity / commodities
    public giveCommodity(itemId: number, amount: number, slotType: "armorSlots" | "itemSlots"): void {
        var item = this.getItem(itemId);
        var inventory = this.getInventory();
        if(!item) return;

        var hasItChanged = false;
        for(let i = 0; i < inventory[slotType].length; i++) {
            if(inventory[slotType][i].itemId == itemId && item.stackable) {
                inventory[slotType][i].amount += amount;
                hasItChanged = true;
            }
        }
        if(!hasItChanged) {
            inventory[slotType].push({
                slotId: inventory[slotType].length,
                itemId: item.itemId,
                amount: amount
            });
        }

        this.setInventory(inventory);
    }

    // Remove a commodity / commodities from the player's inventory
    public removeFromInventory(slot: number, slotType: "armorSlots" | "itemSlots"): void {
        var inventory = this.getInventory();

        for(let i = 0; i < inventory[slotType].length; i++) {
            if(i == slot) {
                inventory[slotType] = Utils.arrayItemDelete(inventory[slotType], inventory[slotType][i]);
            }
        }

        this.setInventory(inventory);
    }

    private storeData(storeKey: string, data: string): void {
        var storage = window.localStorage;
        var encrypt_data = XXTEA.encrypt(XXTEA.toBytes(data), xxteaKey);
        storage.setItem(storeKey, Buffer.from(encrypt_data).toString("base64"));
    }

    private fetchData(storeKey: string): string | null {
        var storage = window.localStorage;
        var encrypt_data = storage.getItem(storeKey);
        if(encrypt_data == null) return null;

        return XXTEA.toString(XXTEA.decrypt(encrypt_data, xxteaKey));
    }
}
