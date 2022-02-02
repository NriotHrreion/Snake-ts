/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";

export default class Docs extends Component {
    public render(): ReactElement {
        return (
            <div className="dialog-page" id="docs">
                <h2>How To Play</h2>
                <a href="./index.html">&lt; Back</a>

                <div className="contents">
                    <p><em>By NriotHrreion</em></p>

                    <p>Thanks for your playing! Here is the guide.</p>

                    <p>First, press <code>"Space"</code> to start the game.</p>

                    <p>Then you can control your snake by <code>"PgUp", "PgDn", "Left", "Right"</code> or by <code>w, a, s, d</code>.</p>

                    <p>If you're using your phone to play, you can click the screen to control the snake.</p>

                    <p>Next, in the map, you may see a red block. It's the food as well as your goal.</p>

                    <p>When you see a deep red block, don't eat it. Because that's a bomb. If you eat it, you will lose 5 scores or "game over".</p>

                    <p>During playing, the game may spawn a purple block (candy) in the map. If you eat it, you will get faster for 5 seconds.</p>

                    <p>Also, the brown block (snickers) is a nice thing to eat. When eat it, you can ignore the bomb for a period of time.</p>

                    <p>Remember to pay attention to the ghost (a guy who is keeping moving), it will follow you and it gonna eat you!</p>

                    <p>To earn money for your wallet, you can try your best to play the game. After 'game over' (the snake died), the score will change into money and come to your wallet.</p>
                    
                    <p>To use the item you have, press <code>"u"</code>.</p>

                    <p>The game hasn't been completely supported for mobile. And I'll try my best to complete it. To contribute, see: <a href="https://github.com/NriotHrreion/Snake-ts/pulls" target="_blank" rel="noreferrer">The project pulls</a></p>

                    <p><b>Enjoy the game :)</b></p>
                </div>
            </div>
        );
    }
}
