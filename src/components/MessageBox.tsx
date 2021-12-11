/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";

import "../style/msgbox.less";
import gameOverImage from "../style/textures/game_over.png";

export default class MessageBox extends Component {
    public render(): ReactElement {
        return (
            <div className="msgbox-container" id="msgbox">
                <div className="msgbox-header">
                    <img src={gameOverImage} alt="Game Over"/>
                    <h1>You Died</h1>
                </div>
                <div className="msgbox-contents">
                    
                </div>
            </div>
        );
    }
}
