## Notes:

Sequelize can be used for different sql engines, so we have to pass dialect as mysql when configuring it. _It works with promises_ <br>
Deleting products table we created in last module in mysql, as sequelize will manage the tables. <br>
By default, sequelize will log the query executed, to stop it, see https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query/58521268 <br>

16th vid onwards, all new products that are created should be associated to the currently logged (dummy) user (which we passed in the req obj in app.js)

### Relations:

The below pic contains all the relations we'll put in code <br>
<img src="relations.png" width="500" height="500" alt="data relations in code"> <br>
**Note**: the relation `User ---has many---> Product` means here that a user can create many products (tho only admin user can create products, but rn there is no auth) <br>

After we created user table and made its relation with product table in app.js, a new field `userId` was added in product table (which references id in user table (foreign key)). So this happens in all relations <br>

_See_ req.user in app.js <br>

When we make a belongs to association, special methods are added by sequalize. Like we made association product belongs to user, or cart belongs to user, so we got special methods on user like createProduct() and createCart() <br>
They are added to the primary table, like in relation if T1 belongs to T2, then they are added to T2 (like T2.createT1()). <br>

when we return something in a then block which is not a promise, it is automatically wrapped in a immediate resolving promise, like this `return Promise.resolve(user);` <br>

cart-item table contains the cart items for each user, and is linked to both user and cart table. The rows of cart table represents a cart for each user. We can access cart-item table fields through product table too, like this in code: `product.cartItem.quantity` <br>

**Doubt**: for eg in getCart controller, how are we able to access products in the ejs file? we are sending products, which is an array of objects. But each object does not have attributes directly, its structure is different. like [products {dataValues: {id: 1, ...}}]. but we can access product.id directly <br>

When we should click checkout in cart, all items should be cleared from cart and then create a new order, thats related to some products and a user. <br>
A user can have many orders, and an order belongs to many products (many products have 1 order), and a product belongs to many orders (each product can be present in many orders). So there is a many to many relationship here, thats why a junction table (order-items is also present). <br>

order is somewhat like cart, and orderItem is just like cartItem. There will be different products in each order, order-items stores that (each row having one product of each user)


