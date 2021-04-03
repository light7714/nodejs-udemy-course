const path = require("path");

//dirname returns directory name of path inside it
//mainModule refers to main module that started our project (app.js), and filename returns its name in string
//so returns directory name of project**
//this is actually deprecated
// module.exports = path.dirname(process.mainModule.filename);

//new version of above
module.exports = path.dirname(require.main.filename);
