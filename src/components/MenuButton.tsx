/* eslint-disable eqeqeq */
import { Component, ReactElement } from "react";
import { Button } from 'react-bootstrap';

export default class MenuButton extends Component<ButtonProps, {}> {
    public constructor(props: ButtonProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <Button className="menu-button" href={this.props.link}>{this.props.children?.toString()}</Button>
        );
    }
}

interface ButtonProps {
    link: string
}
