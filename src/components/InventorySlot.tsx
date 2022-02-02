/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import Utils from "utils";
import { Slot } from "../shop/Inventory";
import Shop from "../shop/Shop";

export default class InventorySlot extends Component<InventorySlotProps, InventorySlotState> {
    public constructor(props: InventorySlotProps) {
        super(props);

        this.state = {
            amount: 0
        };
    }

    private selectHandle(): void {
        var slotSelectEvent = new CustomEvent("slotSelect", {
            detail: {
                slotId: this.props.slot.slotId,
                slotType: this.props.type
            }
        });
        document.body.dispatchEvent(slotSelectEvent);
    }

    public render(): ReactElement {
        var itemInfo = Shop.get().getItem(this.props.slot.itemId);
        if(!itemInfo) return <div className="slot"></div>;

        return (
            <div
                className="slot" 
                id={"slot-"+ this.props.type +"-"+ this.props.index} 
                style={{backgroundImage: "url("+ itemInfo.icon +")"}} 
                title={itemInfo.name} 
                onClick={() => this.selectHandle()}>
                <span id="amount">{this.state.amount}</span>
            </div>
        );
    }

    public componentDidMount(): void {
        this.setState({amount: this.props.slot.amount});

        document.body.addEventListener("itemUse", () => {
            var amount = Shop.get().getInventory().itemSlots[this.props.slot.slotId].amount;
            
            if(amount <= 0) {
                var elemId = "slot-"+ this.props.type +"-"+ this.props.index;
                Utils.getElem(elemId).parentElement?.removeChild(Utils.getElem(elemId));

                var inv = Shop.get().getInventory();
                inv.itemSlots = Utils.arrayItemDelete(inv.itemSlots, inv.itemSlots[this.props.slot.slotId]);
                Shop.get().setInventory(inv);
                
                return;
            }

            this.setState({amount: amount});
        });
    }
}

interface InventorySlotProps {
    index: number
    slot: Slot
    type: "armorSlots" | "itemSlots"
}

interface InventorySlotState {
    amount: number
}
