## When editing product
We can pass additional info in route using query params </br>
say we want additional confirmation by ensuring ppl have to pass us a query parameter in the url. It can look like /edit-product/:productId?edit=true&title=new&............so on. </br>
its a key value pair, and we can pass any number of query parameters as we want. its optional data. </br>
The route which gets reached is determined till the ? mark, so no need to add anything in routes/admin.js file in edit products route. </br>
But actually sending query params and checking them is actually of no use *here*, as we already know we're editing a product (as we have different route and controller function for editing product), but its just for demonstration rn. </br>
It can be used for tracking a user, or keeping a certain filter which a user has set on a certain page