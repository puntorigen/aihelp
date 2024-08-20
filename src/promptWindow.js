const { BrowserWindow } = require('electron');
const path = require('path');

module.exports = function openPromptWindow() {
  let win = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'promptPreload.js')
    }
  });
  win.loadURL(`file://${path.join(__dirname, '../html/prompt.html')}`);
};
