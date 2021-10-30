/* eslint-disable eqeqeq */
// Import Modules
import { Component, ReactElement } from "react";
import Utils from "utils";
// Layout Style
import "style/layout.less";
// Components
import Board from "components/Board";
import Game from "components/Game";
import Settings from "pages/Settings";
import About from "pages/About";

const tipMessage = "Press 'space' to start the game!";

export default class SnakeGame<P> extends Component<{}, MainState> {
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

    private resetHandle(): void {
        var gameResetEvent = new CustomEvent("gameReset");
        document.body.dispatchEvent(gameResetEvent);

        this.setState({
            tipMessage: tipMessage
        });
    }

    private settingsHandle(): void {
        var settingsDialog = document.getElementById("settings");
        if(!settingsDialog) return;

        if(!this.isSettingsOpen && !this.isAboutOpen) {
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

        if(!this.isAboutOpen && !this.isSettingsOpen) {
            aboutDialog.style.width = "340px";
            this.isAboutOpen = true;
        } else {
            aboutDialog.style.width = "0";
            this.isAboutOpen = false;
        }
    }

    public render(): ReactElement {
        return (
            <div className="main-container">
                <Board/>
                <Game/>

                <Settings/>
                <About/>

                <p className="tip-message">{this.state.tipMessage}</p>
                <button className="bottom-button" onClick={() => this.aboutHandle()}>About</button>
                <button className="bottom-button" onClick={() => this.settingsHandle()}>Settings</button>
                <button className="bottom-button" onClick={() => this.resetHandle()}>Reset</button>
            </div>
        );
    }

    public componentDidMount(): void {
        // colorful skin player
        var colorfulSkin = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any).colorfulSkin;
        if(colorfulSkin) {
            var h = 359
            this.colorfulSkinTimer = setInterval(() => {
                Utils.setBgOfAllClasses("snake-body", this.currentSkin);
                
                h--;
                if(h < 0) h = 359;
                this.currentSkin = "hsl("+ h.toString() +",100%,50%)";
            }, 10);
        }

        document.body.addEventListener("keydown", (e) => {
            if(e.key == " ") { // game start
                e.preventDefault();
                this.setState({
                    tipMessage: ""
                });
            }
        });
        document.body.addEventListener("settingsChange", (e: CustomEvent) => {
            if(e.detail.type == "colorfulSkin") {
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
