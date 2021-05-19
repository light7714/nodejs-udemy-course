# This module is for both 15th and 16th module

-> 1st step, changed user model schema a bit

## Cross Site Request Forgery

This happens when an attacker makes a similar looking site to our site, tricks a user to go there, then a user cliks some link or button or even views an image, the fake site sends a request to our server behind the scenes and does something unintended using our session. <br>
->`Eg.` Say to delete your account on Udemy, all they have is this endpoint:
`www.udemy.com/delete/account` <br>
When you're logged in and you visit that URL, your account is completely deleted. What a CSRF attack does, is if you're currently authenticated on Udemy and you visit some other third party site that has an image tag like: <br>
`<img src="www.udemy.com/delete/account" />`
That will trigger the account deletion without you knowing it. <br>

-> or another `Eg.` <br>
For instance, the fake site could have a fake login page and send a post request to our server, using axios or something similar let's say. Then our server would register a session and send back a cookie. The fake site could then use that cookie to fake future requests that the user would make. <br>

To prevent this, we can ensure that ppl can only use our session if they are working with our views, so that the session is not available to any fake page. We will use a csrf token here (by installing csurf)<br>

csrf token is a string we can embed in our forms or pages (views) (unique for each view or form) for every request that does something on the backend that changes the user's state. The csurf package then will check if the incoming request has that token.

So for any non get requests, the csrf middleware (in app.js) will look for a csrf token in the incoming request body.

-> For eg. in logout button, its enclosed in a form sending a post req, so we added this: <br>
`<input type="hidden" name= "_csrf" value="<%= csrfToken %>">` <br>
csrfToken passed in res.render, name of \_csrf is imp here, cuz the csurf package will look for this name receiving this post req

->In our render fns, we are passing:

```isAuthenticated: req.session.isLoggedIn,
csrfToken: req.csrfToken()
```

but this is a bit cumbersome as we have to pass it in all render fns

-> Added the hidden input with name \_csrf to all forms in views, where some sensitive data is handled (logout, add-to-cart, edit-product, login, signup, delete-product, delete-from-cart, order-now)

## Feedback

We need to provide some feedback too, like when user entered wrong password, we dont just wanna redirect back to login page, we want to show a msg too. Rn we are calling res.redirect directly in these cases, but now there is a problem of how to pass an error msg to the view which it can display (cuz it wont know if the req came from a redirect or browser).

So we need to store some error data before we redirect, and then use in the new request to render view with error (for that user). We can use a session (as we need to store data across requests). But we dont wanna store the msg to the session permanently, we want to store it temporarily (called flash it to the session) and once we pulled it out of the session (and did something with it), we need to remove it from session, so that for subsequent reqs, its not part of session anymore. Using another package connect-flash for that.

**NOTE**: when not logged in, it'll create a session on which the msg will be flashed, and then pulled out, but still that session will exist with empty flash obj. After logging in, in that same session isLoggedIn and user obj will be stored. SO new sessions are not created, on that same session dataa is stored (on that session only the csrf token is also there).

## Emails
We dont usually make our own email server (as node has no support for doing that, and its very complex), we typically use 3rd party email server. We'll use SendGrid here.

installed nodemailer (to send emails from inside nodejs), nodemailer-sendgrid-transport

-> To generate api keys, I went to sendgrid website, settings => api key => create new. Added node-shop as name. we get api key only once (also do single sender verification)