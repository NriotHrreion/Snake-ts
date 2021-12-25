/* eslint-disable eqeqeq */
import React, { Component, ReactElement } from "react";
import Utils from "../utils";

export default class Settings<P> extends Component<{}, SettingsState> {
    public constructor(props: P) {
        super(props);
    }

    public render(): ReactElement {
        var storage = window.localStorage;

        if(storage.getItem("snake-ts.settings") == null) {
            storage.setItem("snake-ts.settings", JSON.stringify({
                colorfulSkin: false,
                throughWall: true,
                skinColor: "#0468d7"
            } as GameSettings));
        }

        var settings = JSON.parse(storage.getItem("snake-ts.settings") as any) as GameSettings;

        return (
            <div className="dialog-page" id="settings">
                <h2>Settings</h2>

                <p>Colorful Skin <code>(refresh)</code>: <Switcher default={settings.colorfulSkin} storeKey="colorfulSkin"/></p>
                <p>Through Wall: <Switcher default={settings.throughWall} storeKey="throughWall"/></p>
                <p>Skin Color: <ColorPicker default={settings.skinColor} storeKey="skinColor"/></p>
                <p>Generate Wall: <Switcher default={settings.generateWall} storeKey="generateWall"/></p>

                <p><code>* "(refresh)" means the page will auto refresh when the option changes.</code></p>
            </div>
        );
    }

    public componentDidMount(): void {
        var settings = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any) as GameSettings;
        Utils.setBgOfAllClasses("snake-body", settings.skinColor);
    }
}

class Switcher extends Component<SwitcherProps, SwitcherState> {
    public constructor(props: SwitcherProps) {
        super(props);

        this.state = {
            isEnabled: this.props.default
        };
    }

    private clickHandle(): void {
        this.setState({
            isEnabled: this.state.isEnabled ? false : true
        });

        var storage = window.localStorage;
        var settings = JSON.parse(storage.getItem("snake-ts.settings") as string) as GameSettings;

        settings[this.props.storeKey] = this.state.isEnabled ? false : true;
        storage.setItem("snake-ts.settings", JSON.stringify(settings));
    
        var settingsChangeEvent = new CustomEvent("settingsChange", {
            detail: {
                type: this.props.storeKey,
                enabled: this.state.isEnabled ? false : true
            }
        });
        document.body.dispatchEvent(settingsChangeEvent);
    }

    public render(): ReactElement {
        return (
            <button className="switcher" onClick={() => this.clickHandle()}>{this.state.isEnabled ? "Enabled" : "Disabled"}</button>
        );
    }
}

class ColorPicker extends Component<ColorPickerProps, ColorPickerState> {
    public constructor(props: ColorPickerProps) {
        super(props);

        this.state = {
            value: this.props.default
        };
    }

    private changeHandle(e: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            value: e.target.value
        });

        var storage = window.localStorage;
        var settings = JSON.parse(storage.getItem("snake-ts.settings") as string) as GameSettings;

        settings[this.props.storeKey] = this.state.value;
        storage.setItem("snake-ts.settings", JSON.stringify(settings));

        Utils.setBgOfAllClasses("snake-body", this.state.value);
    }

    public render(): ReactElement {
        return (
            <input type="color" value={this.state.value} onChange={(e) => this.changeHandle(e)}/>
        );
    }
}

interface SettingsState {

}

interface SwitcherProps {
    default: boolean
    storeKey: "colorfulSkin" | "throughWall" | "generateWall"
}

interface SwitcherState {
    isEnabled: boolean
}

interface ColorPickerProps {
    default: string
    storeKey: "skinColor"
}

interface ColorPickerState {
    value: string
}

interface GameSettings {
    colorfulSkin: boolean
    throughWall: boolean
    skinColor: string
    generateWall: boolean
}
