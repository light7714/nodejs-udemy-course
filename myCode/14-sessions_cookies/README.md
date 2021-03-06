### Cookies

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

-> For seeing cookies set, in browser go to inspect, application tab and go to cookies. We can see our set cookie there, and also some other cookies set by extensions, plugins, etc.

-> After setting cookie on browser, the browser also sends the cookie back to the server with every request. We can see that in network tab in browser by clicking name of req sent, in request headers.

-> **But** the user can go to dev tools on browser and change the cookie from false to true, to gain access.. SO while cookies are generally a nice thing for storing data across requests (tracking users etc), we shouldnt store sensitive data there. Sessions can help here.

-> *Info*: A cookie can also be sent to another page (for tracking). Like there is a tracking pixel on pages, which in an image url with no real image, but that image is located on (lets say) google's servers, so with any request sent to the website's server, a request (get) is also sent to google, and if we have a cookie on that page, thats also sent. This way they can track on which page we are and how we're moving thru web even when we're not on their websites (the cookie is stored on our browser, sent to google every time we visit a page with their tracker) (Other mechs also exist, like sending cookie to a domain). We can delete that cookie on our side ofc, thats why blocking mechanisms and extensions exist.

-> Set-Cookie header values:
```
//*rn the expiration date is session, so it'll expire once we close the browser, if we dont want that, we can set an expiration date (in http date format) like this: res.setHeader('Set-Cookie', 'loggedIn=true; Expires={httpDateFormat}')
//*we can also set it to expire after certain seconds, with Max-Age: res.setHeader('Set-Cookie', 'loggedIn=true; Max-Age=10')
//*Can also specify domain to which cookie can be sent with Domain={someDomain}
//*can set Secure (without any value), means the cookie will be set only when page is served via https (so we wont see cookie rn as we dont have https)
//*can set HttpOnly key (without value), means we cant access the cookie value through client side scripts, an imp security mech as it protects from cross site scripting attacks
```

### Session
-> We'll store if a user is logged in or not in a session on the server side (1st in memory, then in db) as we want that info across all requests of the same user. <br>

->A client needs to tell the server to which session it belongs. We'll use a cookie, which will stores the id of the session. The value will hashed id, where only the server can confirm that it hasnt been tampered with. <br>

-> When using session, we're not setting cookie ourselves. After registering session middleware in app.js and writing `req.session.isLoggedIn = true;` in postLogin controller, we see a new cookie added in browser, named connect.sid (session id). Its value is a long string (encrypted value). By default its session cookie (session here means it'll expire after clsing browser)


-> Registering the session middleware in app.js doesnt create a new session (assuming no server reload) on each request, it did only for the 1st request, after a session cookie has been set (in postLogin, isLoggedIn=true), logging that on a new request always shows true (till that browser isnt closed) as this session is identified for a browser (so a user) because we have that cookie on the browser. Thats why if we open a new browser, we'll see undefined logged in `console.log(req.session.isLoggedIn);`.

-> session is different from session cookie (session cookie is a cookie which goes away after browser closed, session is a construct in memory or db) (tho here the browser still stores the cookie even after it is closed, even tho on browser its expiry date shows session.. it seems it depends on browser)

-> When using mongodb to store sessions, we can see that for each new browser, a new session doc is made.

-> The session in server checks the cookie (which stores the session id) for each request, thats how the server knows which user sent a request.

-> When isAuthenticated is true, the user related links (admin links, add to cart, cart, orders) will be shown. Login will be shown when user is not authenticates, logout will be shown if user is authenticated.

-> RN proper authentication is not there, so if a user manually enters a route which they are not supposed to go to (like go to add-product page), then still the page will be shown (req.session.isLoggedIn is undefined, treated as false in bool check in views) (as route is still avlbl).

-> **IMP** req.session.user is not a mongoose object, just plain object. https://stackoverflow.com/questions/18512461/express-cookiesession-and-mongoose-how-can-i-make-request-session-user-be-a-mon/18662693#18662693