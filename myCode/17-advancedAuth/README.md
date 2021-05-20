## Reset Password

Person would enter email id and receive email with a link for resetting.

For that we need to create a unique token with an expiry date so that the reset link includes that token, and we can verify that password is changed thru the link we sent only

The token will be stored in the user model.

The reset link will be localhost:8000/reset/{token} (see auth.js)
