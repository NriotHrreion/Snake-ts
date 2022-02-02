/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";
import Shop from "./Shop";
import commodities, { Commodity } from "./Commodities";

export default class ShopPage<P> extends Component<{}, ShopPageState> {
    public constructor(props: P) {
        super(props);

        this.state = {
            wallet: Shop.get().getWallet()
        };
    }

    public render(): ReactElement {
        return (
            <div className="shop-container">
                <h2>Shop <span id="wallet">{"Your Wallet: "+ this.state.wallet +"$"}</span></h2>
                <a href="/index.html">&lt; Back</a>

                <div className="list">
                    {
                        commodities.map((c, index) => {
                            return <ShopItem
                                key={index} 
                                commodity={c}
                                onBuy={(ml) => this.setState({wallet: ml})}/>;
                        })
                    }
                </div>
            </div>
        );
    }
}

class ShopItem extends Component<ShopItemProps, {}> {
    private commodity: Commodity;
    
    public constructor(props: ShopItemProps) {
        super(props);

        this.commodity = this.props.commodity;
    }

    private buyHandle(): void {
        Shop.get().buyCommodity(this.commodity.id);
        this.props.onBuy(Shop.get().getWallet());
    }

    public render(): ReactElement {
        return (
            <div className="shop-item" onClick={(e) => {
                if(!(e.target as HTMLElement).classList.contains("shop-item-buy")) {
                    window.location.href = "#/shop/"+ this.commodity.id;
                }
            }}>
                <div className="shop-item-icon">
                    <img src={this.commodity.icon} alt={this.commodity.name}/>
                </div>
                <div className="shop-item-description">
                    <p id="name">{this.commodity.name}</p>
                    <p id="price">{this.commodity.price +"$"}</p>
                </div>
                <div className="shop-item-buttons">
                    <Button className="shop-item-buy" variant="success" onClick={() => this.buyHandle()}>Buy</Button>
                    <Button className="shop-item-link" variant="secondary" href={"#/shop/"+ this.commodity.id}>Details</Button>
                </div>
            </div>
        );
    }
}

interface ShopPageState {
    wallet: number
}

interface ShopItemProps {
    commodity: Commodity
    onBuy: (moneyLeft: number) => any
}
