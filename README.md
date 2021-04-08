# nodejs-udemy-course
Files for [node + express course](https://www.udemy.com/course/nodejs-the-complete-guide/)

Note:
In 7th module and onwards, nodemonconfig is added to package.json to ignore data/products.json file. This is done because when adding something to products.json file thru post req, nodemon restarts and somehow blocks css files on public folder, so there is no css styling, but is there after reload.
