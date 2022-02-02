import Axios from "axios";

export default class Updater {
    /**
     * Current Version
     * 
     * This variable will be change when a new version is released.
     * If the user doesn't update the game, the variable will still be the version that the user is using.
     */
    private version: string = "3.0.0";

    public getCurrentVersion(): string {
        return this.version;
    }

    /**
     * This is a method that returns a Promise object
     * 
     * @async
     */
    public async getLatestVersionInfo(): Promise<{}> {
        var result: VersionInfo = {
            version: "",
            downloadURL: ""
        };

        await Axios.get("https://api.github.com/repos/NriotHrreion/Snake-ts/releases/latest").then((res) => {
            var data = res.data as ReleasesCallbackData;
            result.version = data.tag_name;
            result.downloadURL = data.assets[0].browser_download_url;
        }).catch((err) => {
            throw err;
        });

        return result;
    }

    public update(url: string): void {
        Axios.post("http://127.0.0.1:6033/downloadSetup", url);
    }
}

interface ReleasesCallbackData {
    tag_name: string
    assets: {
        name: string
        browser_download_url: string
    }[]
}

interface VersionInfo {
    version: string
    downloadURL: string
}
