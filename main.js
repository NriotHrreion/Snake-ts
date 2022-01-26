const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");

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
