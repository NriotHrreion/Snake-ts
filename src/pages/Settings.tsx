/* eslint-disable eqeqeq */
import React, { Component, ReactElement } from "react";
import Utils from "../utils";

import { Button } from 'react-bootstrap';

export default class Settings<P> extends Component<{}, SettingsState> {
    public constructor(props: P) {
        super(props);
    }

    private renderEasterOption(): ReactElement | null {
        var storage = window.localStorage;
        var settings = JSON.parse(storage.getItem("snake-ts.settings") as any) as GameSettings;
        var easter = storage.getItem("snake-ts.easter");

        if(easter == null || easter == "0") return null;

        return (
            <p>{Utils.newGUID()} <Switcher default={settings.easter} storeKey="easter"/></p>
        );
    }

    public render(): ReactElement {
        var storage = window.localStorage;
        var settings = JSON.parse(storage.getItem("snake-ts.settings") as any) as GameSettings;

        return (
            <div className="dialog-page" id="settings">
                <h2>Settings</h2>
                <a href="./index.html">&lt; Back</a>

                <div className="contents">
                    <p>Colorful Skin <code>(refresh)</code> <Switcher default={settings.colorfulSkin} storeKey="colorfulSkin"/></p>
                    <p>Through Wall <Switcher default={settings.throughWall} storeKey="throughWall"/></p>
                    <p>Skin Color <ColorPicker default={settings.skinColor} storeKey="skinColor"/></p>
                    <p>Generate Wall <code>(refresh)</code> <Switcher default={settings.generateWall} storeKey="generateWall"/></p>
                    {this.renderEasterOption()}

                    <p><code>* "(refresh)" means the page will auto refresh when the option changes.</code></p>
                </div>
            </div>
        );
    }

    public componentDidMount(): void {
        var settings = JSON.parse(window.localStorage.getItem("snake-ts.settings") as any) as GameSettings;
        Utils.setBgOfAllClasses("snake-body", settings.skinColor);

        // If the user has opened "generateWall", the "throughWall" button will be disabled,
        // so that the "generateWall" feature won't be meaningless
        if(settings.generateWall) {
            var throughWallSwitcher = Utils.getElem("throughWall") as HTMLButtonElement;

            if(!settings.throughWall) {
                throughWallSwitcher.click();
            }
            throughWallSwitcher.disabled = true;
        }

        // If the user has opened "throughWall", the "generateWall", the "generateWall" button will be disabled
        if(!settings.throughWall) {
            var generateWallSwitcher = Utils.getElem("generateWall") as HTMLButtonElement;

            if(generateWallSwitcher.innerText == "Enabled") {
                generateWallSwitcher.click();
            }
            generateWallSwitcher.disabled = true;
        }
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
        
        if(this.props.storeKey == "throughWall") {
            var generateWallSwitcher = Utils.getElem("generateWall") as HTMLButtonElement;

            // Prevent the user enable "generateWall" while the "throughWall" is disabled
            if(this.state.isEnabled) {
                if(generateWallSwitcher.innerText == "Enabled") {
                    generateWallSwitcher.click();
                }
                generateWallSwitcher.disabled = true;
            } else {
                generateWallSwitcher.disabled = false;
            }
        }

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
            <Button id={this.props.storeKey} className="switcher" onClick={() => this.clickHandle()}>{this.state.isEnabled ? "Enabled" : "Disabled"}</Button>
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
    storeKey: "colorfulSkin" | "throughWall" | "generateWall" | "easter"
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
    easter: boolean
}
