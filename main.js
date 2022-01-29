const { app, BrowserWindow, Menu, dialog } = require("electron");
const fs = require("fs");
const path = require("path");
const child_process = require("child_process");
const http = require("http");
const https = require("https");

function createWindow () {
    const win = new BrowserWindow({
        width: 1300,
        height: 750,
        resizable: false,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    win.setIcon(new URL(path.join(__dirname, "./build/icon_snake.png"), "file:").href);
    win.loadURL(new URL(path.join(__dirname, "./build/index.html"), "file:").href);

    Menu.setApplicationMenu(Menu.buildFromTemplate([
        {
            label: "Back",
            click: function() {
                win.loadURL(new URL(path.join(__dirname, "./build/index.html"), "file:").href);
            }
        },
        {
            label: "About",
            click: function() {
                dialog.showMessageBox(win, {
                    title: "About",
                    message: "This is a Snake Game, and it's written in React + TypeScript.\nThe project is open source on Github. You can build and play it on your computer or play it online.\n\nCopyright (c) NriotHrreion "+ new Date().getFullYear(),
                    type: "info"
                });
            }
        }
    ]));

    /**
     * Create a server that can do the update action which is sent from the client
     * (The client doesn't support the node.js api, so just send a post req to the node.js server)
     */
    http.createServer((req, res) => {
        if(req.url === "/downloadSetup" && req.method === "POST") {
            var url = ""; // 'url' is a REDIRECT url from github.com
            var exeDir = path.dirname(app.getPath("exe"));

            // Receive the redirect url
            req.on("data", (c) => {
                url = c.toString();
            });

            req.on("end", () => {
                if(!fs.existsSync(path.join(exeDir, "./installer"))) {
                    fs.mkdirSync(path.join(exeDir, "./installer"));
                }

                if(fs.existsSync(path.join(exeDir, "./installer/setup.exe"))) {
                    installUpdate();
                    return;
                }

                console.log(url +"\n"+ exeDir);

                var writer = fs.createWriteStream(path.join(exeDir, "./installer/setup.exe"));

                /**
                 * The hostname of 'url' is github.com
                 * It will return a 302 redirect header and the header is point to a final download url
                 */
                https.get(url, (redirect) => {
                    /**
                     * Send a req to the final download url and begin downloading setup.exe
                     */
                    https.get(redirect.headers.location, (res) => {
                        const length = parseInt(res.headers["content-length"]);
                        const total = (length / 1048576).toFixed(2);
                        var cur = 0;
    
                        res.on("data", (chunk) => {
                            cur += chunk.length;
                            var progress = (100.0 * cur / length).toFixed(2);
                            var currentProgress = (cur / 1048576).toFixed(2);
    
                            // console.log("Progress: %d %d, Total: %d", parseFloat(progress) / 10, currentProgress, total);

                            win.setProgressBar(parseFloat(progress).toFixed(1) / 100);
                        });
    
                        res.on("end", () => {
                            win.setProgressBar(2, {mode: "indeterminate"}); // let the progress bar disappear

                            // Run the setup.exe to begin installing
                            installUpdate();
                        });
    
                        res.pipe(writer);
                    });
                });
            });
        }

        function installUpdate() {
            child_process.exec("start "+ path.join(exeDir, "./installer/setup.exe"));
            process.exit(0);
        }
    }).listen(6033);
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") {
        app.quit();
    }
});
