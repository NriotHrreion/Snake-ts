/* eslint-disable eqeqeq */
// Import Modules
import { Component, ReactElement, Fragment } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
import Shop from "shop/Shop";
import Item from "items/Item";
import Updater from "Updater";
import Utils from "utils";
// Layout Style
import "bootstrap/dist/css/bootstrap.css";
import "style/layout.less";
// Pages
import HomePage from "pages/HomePage";
// Components
import Board from "components/Board";
import Game from "components/Game";
import MessageBox from "components/MessageBox";
import Settings from "pages/Settings";
import ShopPage from "shop/ShopPage";
import Docs from "pages/Docs";
import About from "pages/About";
import CommodityDetails from "shop/components/CommodityDetails";
import InventorySlot from "components/InventorySlot";

import favicon from "style/textures/icon_snake.png";

export const tipMessage = "Press 'Space' to start the game!";
export const tipMessageRunning = "Fast Running is available! Press 'Shift' to use.";

export default class SnakeGame<P> extends Component<{}, MainState> {
    private isGameStart: boolean = false;
    private colorfulSkinTimer: any;

    // a map for the dialogs that can help to manage their status (opened or closed)
    private dialogsStatus: Map<string, boolean> = new Map<string, boolean>([
        ["docs", false], ["settings", false], ["about", false]
    ]);

    // only for colorful skin player, isn't the common skin
    private currentSkin: string = "hsl(359,100%,50%)";

    private currentSelectedSlotId: number = 0;
    
    public constructor(props: P) {
        super(props);

        this.state = {
            tipMessage: tipMessage
        };
    }

    private startHandle(): void {
        if(this.isGameStart) return;

        var gameStartEvent = new KeyboardEvent("keydown", {
            key: " "
        });
        document.body.dispatchEvent(gameStartEvent);
    }

    private resetHandle(): void {
        var gameResetEvent = new CustomEvent("gameReset");
        document.body.dispatchEvent(gameResetEvent);

        this.isGameStart = false;

        this.setState({
            tipMessage: tipMessage
        });
    }

    private getCurrentItem(): Item | null {
        var slotId = this.currentSelectedSlotId;
        var shopObj = Shop.get();

        return shopObj.getItem(shopObj.getInventory().itemSlots[slotId].itemId);
    }

    public render(): ReactElement {
        return (
            <HashRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>}></Route>
                    <Route path="/play" element={
                        <Fragment>
                            <div className="main-container">
                                <Board/>
                                <Game/>

                                <MessageBox onMessage={() => {
                                    Utils.getElem("msgbox").style.display = "none";
                                    this.resetHandle();
                                }}/>

                                <p className="tip-message">{this.state.tipMessage}</p>

                                {/* The quit button can't use "href" attribute because of the CSS */}
                                <Button className="bottom-button" onClick={() => window.location.href = "./index.html"}>Quit</Button>
                                <Button className="bottom-button" onClick={() => this.startHandle()}>Start</Button>
                            </div>
                            <div className="inventory-container">
                                <div className="armor-slots">
                                    <h4>Armor Slots</h4>
                                    <div className="slots">
                                        {
                                            /** @todo */
                                            Shop.get().getInventory().armorSlots.map((s, index) => {
                                                return <InventorySlot key={index} index={index} slot={s} type="armorSlots"/>;
                                            })
                                        }
                                    </div>
                                </div>
                                <div className="item-slots">
                                    <h4>Item Slots <span style={{fontSize: "11pt", fontWeight: "lighter"}}>(press 'u' to use)</span></h4>
                                    <div className="slots">
                                        {
                                            Shop.get().getInventory().itemSlots.map((s, index) => {
                                                return <InventorySlot key={index} index={index} slot={s} type="itemSlots"/>;
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    }></Route>
                    <Route path="/settings" element={<Settings/>}></Route>
                    <Route path="/shop" element={<ShopPage/>}></Route>
                    <Route path="/docs" element={<Docs/>}></Route>
                    <Route path="/about" element={<About/>}></Route>

                    {/* Shop Router */}
                    <Route path="/shop/:id" element={<CommodityDetails/>}></Route>
                </Routes>
            </HashRouter>
        );
    }

    public componentDidMount(): void {
        // Check whether the item 'snake-ts.settings' in localStorage is created or not
        // If not, create one
        // issue: #2
        if(window.localStorage.getItem("snake-ts.settings") == null) {
            window.localStorage.setItem("snake-ts.settings", JSON.stringify({}));
        }

        // Setup the favicon
        (document.getElementById("favicon") as HTMLLinkElement).href = favicon;

        // Colorful skin player
        var colorfulSkin = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any).colorfulSkin;
        if(colorfulSkin) {
            // Do a loop for animating the colorful skin.
            var h = 359;
            this.colorfulSkinTimer = setInterval(() => {
                // Set the current color of the skin.
                Utils.setBgOfAllClasses("snake-body", this.currentSkin);
                
                h--;
                if(h < 0) h = 359;
                this.currentSkin = "hsl("+ h.toString() +",100%,50%)";
            }, 10);
        }

        document.body.addEventListener("keydown", (e) => {
            switch(e.key) {
                case " ": // Game Start
                    e.preventDefault();
                    if(!this.isGameStart) {
                        this.isGameStart = true;
                    } else {
                        return;
                    }
            
                    this.setState({
                        tipMessage: tipMessageRunning
                    });
                    break;
                case "Shift": // Fast Running
                    e.preventDefault();    

                    var gameResetEvent = new CustomEvent("snakeRunning", {
                        detail: {
                            main: this // Main Class for Game Class
                        }
                    });
                    document.body.dispatchEvent(gameResetEvent);
                    break;
                case "u":
                    var currentItem = this.getCurrentItem();
                    if(currentItem) { // pass the event to the Game object
                        var itemUseEvent = new CustomEvent("itemUse", {
                            detail: {
                                item: currentItem
                            }
                        });
                        document.body.dispatchEvent(itemUseEvent);
                    }
                    break;
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "colorfulSkin" || e.detail.type == "generateWall") {
                window.location.reload();
            }
        });

        // Slot Select
        const borderColor = "#517aa1";
        Utils.getElem("slot-itemSlots-0").style.borderColor = borderColor;
        document.body.addEventListener("slotSelect", (e: CustomEvent) => {
            var slotId: number = e.detail.slotId;
            var slotType: "armorSlots" | "itemSlots" = e.detail.slotType;
            var slotAmount = Shop.get().getInventory()[slotType].length;

            this.currentSelectedSlotId = slotId;

            for(let i = 0; i < slotAmount; i++) {
                var elem = Utils.getElem("slot-"+ slotType +"-"+ i);
                if(i != slotId) {
                    elem.style.borderColor = "#fff";
                } else {
                    elem.style.borderColor = borderColor;
                }
            }
        });

        // Check update (if the user is using the desktop edition)
        if(window.navigator.userAgent.toLowerCase().indexOf("electron") > -1) {
            var updater = new Updater();
            updater.getLatestVersionInfo().then((latest: VersionInfo) => {
                var currentVersion = updater.getCurrentVersion();

                // Update
                if(latest.version != null && currentVersion != latest.version) {
                    var doUpdate = window.confirm("A latest released version is available. Do you want to update?");

                    if(doUpdate) updater.update(latest.downloadURL);
                }
            });
        }
    }

    public componentWillUnmount(): void {
        clearInterval(this.colorfulSkinTimer);
    }
}

interface MainState {
    tipMessage: string
}

interface VersionInfo {
    version: string
    downloadURL: string
}
