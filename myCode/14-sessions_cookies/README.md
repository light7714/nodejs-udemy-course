## Cookies

For eg. when a user logs in, a req is sent to the server, and the server sends back a cookie which is stored in the client side. Whenever next time the user sends a request to the server, the cookie (or some data related to cookie maybe) is sent to the server, letting the server know that the user is logged in. <br>

-> Will be adding a **dummy login page** to understand cookies, thats why admin related links in the nav bar have been commented at starting, and a login link is added (to route /login, which doesnt exist yet) <br>

-> Whenever a user is logged in, then only the 2 admin links will be displayed (thats why a boolean variable isLoggedIn is stored in the req obj in postLogin controller, it'll be made true after login, is passed to the view (ejs file) whenever any page renders, so we can implement logic of showing or not showing links there)  <br>

->BUT the above point is wrong actually. In the postLogin controller, this is written: <br>

```
req.isLoggedIn = true;
res.redirect('/');
```

<br>
Actually we wont see the 2 admin links here in any page, even after postLogin controller runs <br>
Here, after we send a response, that request is over. The request doesnt persist, or else ppl might be able to see data of other users. <br>
When we're saving a user in req.user, we're doing it in app.js at the topmost level (and calling next(); after saving). So for any request, that user is stored each time a req is made, and deleted when the response is sent.
