import { Component, ReactElement } from 'react';
import Board from 'components/Board';
import Game from 'components/Game';

export default class SnakeGame extends Component {
    public render(): ReactElement {
        return (
            <div className="main-container">
                <Board/>
                <Game/>
            </div>
        );
    }
}
