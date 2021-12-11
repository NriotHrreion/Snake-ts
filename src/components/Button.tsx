/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";

export default class Button extends Component<ButtonProps, {}> {
    public constructor(props: ButtonProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <button className="bottom-button" onClick={this.props.onClick}>{this.props.text}</button>
        );
    }
}

interface ButtonProps {
    onClick: () => any
    text: string
}
