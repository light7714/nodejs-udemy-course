<img src="README_files/changes.png" width="500" height="500" alt="changes">

???-In src/pages/Feed/Feed.js (react code), postData.image is undefined sometimes (IDK WHY) when not choosing new image. In backend then undefined as string is passed, and deletes image when it shouldnt...

## Auth with JSON Web Tokens

\*the token can be checked by the server but cannot be stored on the server.
<img src="README_files/auth_working.png" width="500" height="500" alt="working of authentication in rest">

<img src="README_files/token.png" width="500" height="500" alt="token (JWT)">


# Websockets 
When a user adds a post, another user should see it instantly, that is what we'll do realtime using web sockets here. We need to add code to our frontend and backend


->  something wrong in rendering logic, so post not showing, but websockets working....