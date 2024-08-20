const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'electronAPI', {
    setFolderPath: (callback) => ipcRenderer.on('folder-path', (event, path) => callback(path)),
    submitPrompt: (promptText) => ipcRenderer.send('submit-prompt', promptText),
    closeWindow: () => ipcRenderer.send('close-prompt-window'),
    onUpdateStatus: (callback) => ipcRenderer.on('update-status', (event, message) => callback(message)),
  }
);
