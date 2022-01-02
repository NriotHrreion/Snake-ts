import { Component, ReactElement } from "react";

import MenuButton from "components/MenuButton";

import icon from "../style/textures/icon.png";

export default class HomePage extends Component<HomePageProps, {}> {
    public constructor(props: HomePageProps) {
        super(props);
    }

    private startHandle(): void {
        window.location.href = "/play";
    }
    
    public render(): ReactElement {
        return (
            <div className="homepage-container" id="homepage">
                <div className="contents">
                    <div className="header-container">
                        <img src={icon} alt="icon"/>
                    </div>
                    <div className="buttons-container">
                        <MenuButton link="/play">Play</MenuButton>
                        <MenuButton link="/settings">Settings</MenuButton>
                        <MenuButton link="/docs">Help</MenuButton>
                        <MenuButton link="/about">About</MenuButton>
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
