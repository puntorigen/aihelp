// promptScript.js
document.addEventListener('DOMContentLoaded', function () {
  window.electronAPI.setFolderPath((path) => {
    alertify.prompt('AI Help', `Detected folder: ${path}`, '',
      function (evt, value) { // on OK
        window.electronAPI.submitPrompt(value);
        alertify.message('Processing...');
        window.electronAPI.closeWindow();
      },
      function () { // on Cancel
        alertify.error('Action canceled');
        window.electronAPI.closeWindow();
      }
    )
    //.set('reverseButtons', true)
    .set('labels', {ok: 'Execute', cancel: 'Cancel'})
    .set('pinnable', false).set('transition', 'zoom')
    .set('resizable', false).set('modal', false)
    .set('movable', false).set('closable', false);
  });
  /*
  window.electronAPI.setFolderPath((path) => {
    document.getElementById('folderPathDisplay').textContent = `Detected folder: ${path}`;
  });

  document.getElementById('submitBtn').addEventListener('click', () => {
    const promptText = document.getElementById('promptInput').value;
    window.electronAPI.submitPrompt(promptText);
    window.electronAPI.closeWindow();
  });*/

  window.electronAPI.onUpdateStatus((message) => {
    document.getElementById('statusLabel').textContent = message;
  });

});
