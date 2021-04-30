## Notes:

Sequelize can be used for different sql engines, so we have to pass dialect as mysql when configuring it. _It works with promises_ <br>
Deleting products table we created in last module in mysql, as sequelize will manage the tables. <br>
By default, sequelize will log the query executed, to stop it, see https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query/58521268 <br>

16th vid onwards, all new products that are created should be associated to the currently logged (dummy) user (which we passed in the req obj in app.js)

### Relations:

The below pic contains all the relations we'll put in code <br>
<img src="relations.png" width="500" height="500" alt="data relations in code"> <br>
**Note**: the relation `User ---has many---> Product` means here that a user can create many products (tho only admin user can create products, but rn there is no auth)
