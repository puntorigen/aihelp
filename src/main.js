const { app, Tray, Menu, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
//const openPromptWindow = require('./promptWindow');
const getFinderFocusedFolder = require('./finderInteraction');
const actions = require('./actions');

let tray = null;
let promptWindow = null;
let folderPath = null; 

function createPromptWindow() {
    if (promptWindow) {
        promptWindow.focus();
        return;
    }

     // Fetch the folder path using AppleScript before opening the window
     getFinderFocusedFolder((err, folder_path) => {
        if (err) {
            console.error('Error fetching Finder folder:', err);
            return;  // Optionally, handle error more gracefully
        }
        folderPath = folder_path;

        promptWindow = new BrowserWindow({
            width: 600,
            height: 250,
            frame: false,
            transparent: true,
            alwaysOnTop: true,
            webPreferences: {
                preload: path.join(__dirname, 'promptPreload.js'),
                nodeIntegration: false,
                contextIsolation: true
            }
        });

        promptWindow.loadURL(`file://${path.join(__dirname, '../html/prompt.html')}`);
        
        // Send the folder path to the renderer once the HTML is loaded
        promptWindow.webContents.once('did-finish-load', () => {
            promptWindow.webContents.send('folder-path', folderPath);
        });

        promptWindow.on('closed', () => {
            promptWindow = null;  // Cleanup when the window is closed
            folderPath = null;    // Reset the folderPath when window is closed
        });
    });
    //promptWindow.webContents.openDevTools();  // Optional: For debugging
}

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, '../assets/top_icon.png'));
  /*const contextMenu = Menu.buildFromTemplate([
    { label: 'Enter Prompt', click: () => createPromptWindow() }
  ]);*/
  tray.setToolTip('AI Help');
  tray.setContextMenu(null);
  tray.on('click', createPromptWindow);
  //tray.setContextMenu(contextMenu);
});

ipcMain.on('submit-prompt', (event, promptText) => {
    event.sender.send('update-status', 'Processing your request...');
    actions.executeAction(folderPath, promptText, () => {
        event.sender.send('update-status', 'Action completed.');
        event.sender.send('close-prompt-window');  // Close window after completion
    });
});

ipcMain.on('close-prompt-window', () => {
    if (promptWindow) {
        promptWindow.close();
        promptWindow = null;
    }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
