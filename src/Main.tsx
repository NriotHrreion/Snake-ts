// Import Modules
import { Component, ReactElement } from "react";
// Layout Style
import "style/layout.less";
// Components
import Board from "components/Board";
import Game from "components/Game";

export default class SnakeGame<P, S> extends Component<{}, MainState> {
    public constructor(props: P) {
        super(props);

        this.state = {
            tipMessage: "Press 'space' to start the game!"
        };
    }

    public render(): ReactElement {
        return (
            <div className="main-container">
                <Board/>
                <Game/>

                <p>{this.state.tipMessage}</p>
            </div>
        );
    }

    public componentDidMount(): void {
        document.body.addEventListener("keydown", (e) => {
            if(e.key == " ") { // game start
                e.preventDefault();
                this.setState({
                    tipMessage: ""
                });
            }
        });
    }
}

interface MainState {
    tipMessage: string
}
