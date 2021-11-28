/* eslint-disable eqeqeq */
// Import Modules
import { Component, ReactElement } from "react";
import Utils from "utils";
// Layout Style
import "style/layout.less";
// Components
import Board from "components/Board";
import Game from "components/Game";
import Docs from "pages/Docs";
import Settings from "pages/Settings";
import About from "pages/About";

import favicon from "style/textures/icon_snake.png";

export const tipMessage = "Press 'Space' to start the game!";
export const tipMessageRunning = "Fast Running is available! Press 'Shift' to use.";

export default class SnakeGame<P> extends Component<{}, MainState> {
    private isGameStart: boolean = false;
    private isDocsOpen: boolean = false;
    private isSettingsOpen: boolean = false;
    private isAboutOpen: boolean = false;
    private colorfulSkinTimer: any;

    private currentSkin: string = "hsl(359,100%,50%)"; // only for colorful skin player, isn't the common skin
    
    public constructor(props: P) {
        super(props);

        this.state = {
            tipMessage: tipMessage
        };
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

    private docsHandle(): void {
        var docsDialog = document.getElementById("docs");
        if(!docsDialog) return;

        if(!this.isDocsOpen && !this.isAboutOpen && !this.isSettingsOpen) {
            docsDialog.style.width = "360px";
            this.isDocsOpen = true;
        } else {
            docsDialog.style.width = "0";
            this.isDocsOpen = false;
        }
    }

    private settingsHandle(): void {
        var settingsDialog = document.getElementById("settings");
        if(!settingsDialog) return;

        if(!this.isSettingsOpen && !this.isAboutOpen && !this.isDocsOpen) {
            settingsDialog.style.width = "300px";
            this.isSettingsOpen = true;
        } else {
            settingsDialog.style.width = "0";
            this.isSettingsOpen = false;
        }
    }

    private aboutHandle(): void {
        var aboutDialog = document.getElementById("about");
        if(!aboutDialog) return;

        if(!this.isAboutOpen && !this.isSettingsOpen && !this.isDocsOpen) {
            aboutDialog.style.width = "340px";
            this.isAboutOpen = true;
        } else {
            aboutDialog.style.width = "0";
            this.isAboutOpen = false;
        }
    }

    private closeAllDialogs(): void {
        this.isDocsOpen = this.isSettingsOpen = this.isAboutOpen = false;

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

                <p className="tip-message">{this.state.tipMessage}</p>

                {/* buttons in bottom of the page */}
                <button className="bottom-button" onClick={() => this.aboutHandle()}>About</button>
                <button className="bottom-button" onClick={() => this.settingsHandle()}>Settings</button>
                <button className="bottom-button" onClick={() => this.docsHandle()}>Help</button>
                <button className="bottom-button" onClick={() => this.resetHandle()}>Reset</button>
                <button className="bottom-button" onClick={() => this.startHandle()}>Start</button>
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
            var h = 359
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
            if(e.detail.type == "colorfulSkin") {
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
