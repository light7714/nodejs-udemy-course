# My files for each module

Run `npm install` in each directory to initialize the project folder (except in early ones without package.json file) and install the node_modules directory <br>
I have used a slightly different syntax for importing npm modules 11th module onwards (const { express } = require('express');), just to because this enables vscode intellisense fornpm modules

Note: files without a number at the end of their name are the final project files, the other files were made earlier in the course and changed eventually , I made new files so that old code (which was changed in course) is still preserved, with all its comments. *For eg. in 5th module, app.js is the final file which will be used in project, app2.js was the file before it (so it was app.js at some point of time), app1.js was the first app.js file made.*


In 7th module and onwards, nodemonconfig is added to package.json to ignore data/products.json files. This is done because when adding something to products.json file thru post req, nodemon restarts and somehow blocks css files on public folder, so there is no css styling, but is there after reload.

testing
