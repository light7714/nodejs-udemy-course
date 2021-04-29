## Notes:

Sequelize can be used for different sql engines, so we have to pass dialect as mysql when configuring it. *It works with promises* <br>
Deleting products table we created in last module in mysql, as sequelize will manage the tables. <br>
By default, sequelize will log the query executed, to stop it, see https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query/58521268