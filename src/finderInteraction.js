const applescript = require('applescript');

const getFocusedFolder = `tell application "Finder"
  return POSIX path of (target of front window as alias)
end tell`;

module.exports = function getFinderFocusedFolder(callback) {
  applescript.execString(getFocusedFolder, (err, rtn) => {
    if (err) return callback(err);
    callback(null, rtn);
  });
};
