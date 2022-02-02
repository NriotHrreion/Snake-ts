/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Badge, Button } from "react-bootstrap";
import Shop from "../Shop";
import commodities, { Commodity, CommodityType } from "../Commodities";
import Utils from "../../utils";

export default class CommodityDetails<P> extends Component<{}, CommodityDetailsState> {
    private commodity: Commodity | null = null;

    public constructor(props: P) {
        super(props);

        this.state = {
            badgeBgColor: "primary",
            wallet: Shop.get().getWallet()
        };
    }

    private buyHandle(): void {
        if(!this.commodity) return;
        Shop.get().buyCommodity(this.commodity.id);

        this.setState({wallet: Shop.get().getWallet()});
    }

    public render(): ReactElement {
        return (
            <div className="details-container">
                <h2>Shop <span id="wallet">{"Your Wallet: "+ this.state.wallet +"$"}</span></h2>

                <div className="content">
                    <div className="commodity-icon">
                        <img id="icon" src="" alt=""/>
                    </div>
                    <div className="commodity-info">
                        <p>
                            <span id="name"></span>{" "}
                            <Badge id="type" bg={this.state.badgeBgColor}></Badge>{" "}
                            <span id="price"></span>{" "}
                            <span id="amount">Amount: </span>
                        </p>
                        <p><span id="description"></span></p>

                        <Button className="commodity-button" variant="success" onClick={() => this.buyHandle()}>Buy now!</Button>
                        <Button className="commodity-button" variant="secondary" href="#/shop">Cancel</Button>
                    </div>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        var id = parseInt(window.location.href.split("/")[window.location.href.split("/").length - 1]);
        this.commodity = commodities[id - 1];

        if(!this.commodity) return;
        (Utils.getElem("icon") as HTMLImageElement).src = this.commodity.icon;
        (Utils.getElem("icon") as HTMLImageElement).alt = this.commodity.name;
        Utils.getElem("name").innerText = this.commodity.name;
        Utils.getElem("type").innerText = this.commodity.type;
        Utils.getElem("price").innerText = this.commodity.price +"$";
        Utils.getElem("amount").innerText = "Amount: "+ this.commodity.amount;
        Utils.getElem("description").innerHTML = this.commodity.description;

        switch(this.commodity.type) {
            case CommodityType.ITEM:
                this.setState({badgeBgColor: "primary"});
                break;
            case CommodityType.EFFECT:
                this.setState({badgeBgColor: "success"});
                break;
            case CommodityType.ARMOR:
                this.setState({badgeBgColor: "danger"});
                break;
        }
    }
}

interface CommodityDetailsState {
    badgeBgColor: string
    wallet: number
}
