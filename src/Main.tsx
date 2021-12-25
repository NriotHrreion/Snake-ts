/* eslint-disable eqeqeq */
// Import Modules
import { Component, ReactElement } from "react";
import Utils from "utils";
// Layout Style
import "style/layout.less";
// Components
import Board from "components/Board";
import Game from "components/Game";
import MessageBox from "components/MessageBox";
import Docs from "pages/Docs";
import Settings from "pages/Settings";
import About from "pages/About";
import Button from "components/Button";

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

    private getElem(id: string): HTMLElement {
        var elem = document.getElementById(id);
        if(!elem) return document.body;

        return elem;
    }

    /**
     * The following ...Handle() methods are the listener of the bottom buttons.
     */

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

    private openDialog(dialog: string, dialogWidth: number): void {
        var dialogElem = this.getElem(dialog);
        var num = 0;

        this.dialogsStatus.forEach((value, key, map) => {
            if(!value) num++;
        });

        if(num == 3) {
            dialogElem.style.width = dialogWidth.toString() +"px";
            this.dialogsStatus.set(dialog, true);
        } else {
            dialogElem.style.width = "0";
            this.dialogsStatus.set(dialog, false);
        }
    }

    private closeAllDialogs(): void {
        this.dialogsStatus.forEach((value, key, map) => {
            this.dialogsStatus.set(key, false);
        });

        var dialogs = document.getElementsByClassName("dialog-page");
        for(let i = 0; i < dialogs.length; i++) {
            if(!dialogs[i]) continue;

            var elem = dialogs[i] as HTMLElement;
            elem.style.width = "0";
        }
    }

    public render(): ReactElement {
        return (
            <div className="main-container">
                <Board/>
                <Game/>

                {/* dialogs */}
                <Docs/>
                <Settings/>
                <About/>

                {/* msgbox */}
                <MessageBox onMessage={() => {
                    this.getElem("msgbox").style.display = "none";
                    this.resetHandle();
                }}/>

                <p className="tip-message">{this.state.tipMessage}</p>

                {/* buttons in bottom of the page */}
                <Button onClick={() => this.openDialog("about", 340)}>About</Button>
                <Button onClick={() => this.openDialog("settings", 300)}>Settings</Button>
                <Button onClick={() => this.openDialog("docs", 360)}>Help</Button>
                <Button onClick={() => this.resetHandle()}>Reset</Button>
                <Button onClick={() => this.startHandle()}>Start</Button>
            </div>
        );
    }

    public componentDidMount(): void {
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
                case "Escape":
                    e.preventDefault();

                    this.closeAllDialogs(); // When press `esc`, close all dialogs
                    break;
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "colorfulSkin" || e.detail.type == "generateWall") {
                window.location.reload();
            }
        });
        document.getElementById("root")?.addEventListener("click", (e: MouseEvent) => {
            var targetElem = e.target as HTMLElement;

            // When click other place, close all dialogs
            if(targetElem.id == "root" || targetElem.className.indexOf("-container") > -1) this.closeAllDialogs();
        });
    }

    public componentWillUnmount(): void {
        clearInterval(this.colorfulSkinTimer);
    }
}

interface MainState {
    tipMessage: string
}
