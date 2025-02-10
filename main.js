const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let win;

function createWindow() {
    // Create the Electron window
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // Required to disable right-click and devtools
        },
        autoHideMenuBar: true,  // Hides the menu bar
        fullscreenable: true,  // Prevents full-screen mode
        resizable: false,       // Optional: make the window non-resizable
    });

    // Load the index.html page (which will include Phaser)
    win.loadFile('index.html');

    // Disable right-click context menu (this prevents Inspect Element)
    // win.webContents.on('context-menu', (e) => {
    //     e.preventDefault();
    // });

    // // Disable developer tools (right-click -> Inspect Element)
    // win.webContents.on('devtools-opened', () => {
    //     win.webContents.closeDevTools();
    // });

    // Prevent opening DevTools programmatically
    win.webContents.setDevToolsWebContents(null);

    // Handle window close
    win.on('closed', () => {
        win = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
