export default class Inventory {
    public armorSlots: Slot[];
    public itemSlots: Slot[];

    public constructor(armorSlots: Slot[], itemSlots: Slot[]) {
        this.armorSlots = armorSlots;
        this.itemSlots = itemSlots;
    }
}

export interface Slot {
    slotId: number
    itemId: number
    amount: number
}
