/* eslint-disable eqeqeq */
import React, { Component, ReactElement } from "react";

export default class About extends Component {
    public render(): ReactElement {
        return (
            <div className="dialog-page" id="about">
                <h2>About</h2>

                <p>Snake Game in <b>React + TypeScript</b></p>
                
                <h3>Authors</h3>

                <p>NriotHrreion: Developing the game</p>
                
                <p>Deed: Testing the game</p>

                <h3>Links</h3>

                <p>Source Code: <a href="https://github.com/NriotHrreion/Snake-ts">Click Me</a></p>

                <p>Play Online: <a href="https://snake-ts-8258bf.netlify.app">Click Me</a></p>

                <p>My Github Homepage: <a href="https://github.com/NriotHrreion">Click Me</a></p>
                
                <p><em>Copyright &copy; NriotHrreion {new Date().getFullYear()}</em></p>
            </div>
        );
    }
}
