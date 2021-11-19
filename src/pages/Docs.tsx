/* eslint-disable eqeqeq */
import React, { Component, ReactElement } from "react";

export default class Docs extends Component {
    public render(): ReactElement {
        return (
            <div className="dialog-page" id="docs">
                <h2>How To Play</h2>

                <p><em>By NriotHrreion</em></p>

                <p>Thanks for your playing! Here is the guide.</p>

                <p>First, press <code>"Space"</code> to start the game.</p>

                <p>Then you can control your snake by <code>"PgUp", "PgDn", "Left", "Right"</code> or by <code>w, a, s, d</code>.</p>

                <p>Next, in the map, you may see a red block. It's the food as well as your goal.</p>

                <p>When you see a deep red block, don't eat it. Because that's a bomb. If you eat it, you will lose 5 scores or "game over".</p>

                <p>During playing, the game may spawn a purple block (candy) in the map. If you eat it, you will get faster for 5 seconds.</p>

                <p>Also, the brown block (snickers) is a nice thing to eat. When eat it, you can ignore the bomb for a period of time.</p>

                <p>The game hasn't been supported for mobile. And I'll try my best to complete it.</p>

                <p>To contribute, see: <a href="https://github.com/NriotHrreion/Snake-ts/pulls">The project pulls</a></p>

                <p><b>Enjoy the game :)</b></p>
            </div>
        );
    }
}
