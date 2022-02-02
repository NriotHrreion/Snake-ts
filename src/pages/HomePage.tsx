import { Component, ReactElement } from "react";
import { Button } from "react-bootstrap";

import icon from "../style/textures/icon.png";

export default class HomePage extends Component<HomePageProps, {}> {
    public constructor(props: HomePageProps) {
        super(props);
    }
    
    public render(): ReactElement {
        return (
            <div className="homepage-container" id="homepage">
                <div className="contents">
                    <div className="header-container">
                        <img src={icon} alt="icon"/>
                    </div>
                    <div className="buttons-container">
                        <MenuButton link="#/play">Play</MenuButton>
                        <MenuButton link="#/settings">Settings</MenuButton>
                        <MenuButton link="#/shop">Shop</MenuButton>
                        <MenuButton link="#/docs">Help</MenuButton>
                        <MenuButton link="#/about">About</MenuButton>
                    </div>
                </div>
                <div className="info-container">
                    <p id="name">Snake in Typescript</p>
                    <p id="copy">Copyright &copy; NriotHrreion {new Date().getFullYear()}</p>
                </div>
            </div>
        );
    }
}

interface HomePageProps {
    
}

class MenuButton extends Component<ButtonProps, {}> {
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
