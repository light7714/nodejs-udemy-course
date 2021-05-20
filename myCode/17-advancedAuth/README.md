## Reset Password

Person would enter email id and receive email with a link for resetting.

For that we need to create a unique token with an expiry date so that the reset link includes that token, and we can verify that password is changed thru the link we sent only

The token will be stored in the user model.

The reset link will be localhost:8000/reset/{token} (see auth.js)


## Authorization
Restricting permissions of a logged in user. Like a user can delete and edit products which other users have added, and we dont want that. 

We store userId in product, so its easy to do that, we simply load those products on admin products which are created by the logged in user. But we could still manually go to url and edit a product, or we can go to devtools and change hidden product id there to delete another product.

So we also changed postEditProduct and postDeleteProduct to check if that product belongs to the user or not.