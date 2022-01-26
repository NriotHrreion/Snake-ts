/* eslint-disable eqeqeq */
// Import Modules
import { Component, ReactElement, Fragment } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { Button } from "react-bootstrap";
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
import Docs from "pages/Docs";
import Settings from "pages/Settings";
import About from "pages/About";

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
                        </Fragment>
                    }></Route>
                    <Route path="/settings" element={<Settings/>}></Route>
                    <Route path="/docs" element={<Docs/>}></Route>
                    <Route path="/about" element={<About/>}></Route>
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
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "colorfulSkin" || e.detail.type == "generateWall") {
                window.location.reload();
            }
        });
    }

    public componentWillUnmount(): void {
        clearInterval(this.colorfulSkinTimer);
    }
}

interface MainState {
    tipMessage: string
}
