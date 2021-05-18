-> 1st step, changed user model schema a bit

**Note**: rn even if i am logged in, i can go to login page and login again... tho another session wont be stored, as the cookie will be matched.. bubt still we should protect auth routes too

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
```<input type="hidden" name= "_csrf" value="<%= csrfToken %>">``` <br>
csrfToken passed in res.render, name of _csrf is imp here, cuz the csurf package will look for this name receiving this post req

->In our render fns, we are passing 
```isAuthenticated: req.session.isLoggedIn,
csrfToken: req.csrfToken()``` but this is a bit cumbersome as we have to pass it in all render fns

-> Added the hidden input with name _csrf to all forms in views, where some sensitive data is handled (logout, add-to-cart, edit-product, login, signup, delete-product, delete-from-cart, order-now)