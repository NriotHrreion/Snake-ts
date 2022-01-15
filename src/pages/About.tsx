/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";

export default class About extends Component {
    private c: number = 0;

    public constructor() {
        super({});

        var storage = window.localStorage;
        if(storage.getItem("snake-ts.easter") == null) {
            storage.setItem("snake-ts.easter", "0");
        }
    }
    
    private easterHandle() {
        this.c++;

        if(this.c == 5) {
            var storage = window.localStorage;
            var easter = storage.getItem("snake-ts.easter") == "0" ? false : true;

            if(!easter) {
                storage.setItem("snake-ts.easter", "1");
                alert("Easter Mode has been opened!");
            } else {
                storage.setItem("snake-ts.easter", "0");
                alert("Easter Mode has been closed!");
            }

            this.c = 0;
        }
    }

    public render(): ReactElement {
        return (
            <div className="dialog-page" id="about">
                <h2 onClick={() => this.easterHandle()} onTouchCancel={() => this.easterHandle()}>About</h2>

                <div className="contents">
                    <p>This is a Snake Game, and it's written in <b>React + TypeScript</b></p>
                
                    <p>The project is open source on Github. You can build and play it on your computer or play it online.</p>

                    <p>If there is any bug or issue, please <a href="https://github.com/NriotHrreion/Snake-ts/issues">tell me</a>.</p>
                    
                    <p><b>Fun fact</b>: It's been about half a year since I started the project.</p>
                </div>
                
                <h4>Authors</h4>

                <div className="contents">
                    <p><code>NriotHrreion</code>: Develop the game</p>
                
                    <p><code>Deed</code>: Draw texture & Test the game</p>
                </div>

                <h4>Links</h4>

                <div className="contents">
                    <p>Source Code: <a href="https://github.com/NriotHrreion/Snake-ts">Click Me</a></p>

                    <p>Play Online: <a href="https://snake-ts.nin.red">Click Me</a></p>

                    <p>My Github Homepage: <a href="https://github.com/NriotHrreion">Click Me</a></p>

                    <p>License: <a href="https://raw.githubusercontent.com/NriotHrreion/Snake-ts/main/LICENSE">Click Me</a></p>
                
                    <p><em>Copyright &copy; NriotHrreion {new Date().getFullYear()}</em></p>
                </div>
            </div>
        );
    }
}
