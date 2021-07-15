# Deploying (my) SSR code here

-- use npm run start:dev to start server with nodemon

-   Instead of making an .env file, we can also make nodemon.json file (nodemon config)

```
{
    "env": {
        "USER": __,
        "PW": __
    }
}
```

But in deployment, we wont be using nodemon.
In vid, he has used env variables in package.json in start script

```
"start": "NODE_ENV=production MONGO_USER=maximilian MONGO_PASSWORD=9u4biljMQc4jjqbe MONGO_DEFAULT_DATABASE=shop STRIPE_KEY=sk_test_whatever node app.js"
```

Use cross-env package for it to work in windows (instead of NODE_ENV up there)
But ofc dotenv is better, it works on both linux and windows

### BUT, dotenv is not used in production

https://stackoverflow.com/questions/67604414/why-i-should-not-use-dotenv-in-production-mode
USE this instead:

```
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
```

NODE_ENV is an env variable set automatically by hosting providers, but for development, setting it on own. Express uses that variable to determine env mode, for prodution it will change certain things, like reducing details for errors, optimise things, etc.

-- setting secure headers
using helmet package for it, will add certain headers to responses we send, see docs to see which headers it sets to mitigate some attack patterns.

-- compression package used for asset compression. only files above 1kb are compressed. img files are not compressed, as it makes them longer to load. Many hosting providers do it for us.

-- morgan package for logging. often logging is done by hosting providers though. not pushing log file to github.

### TLS

server has public and private key. (public to encrypt, pvt to decrypt). In TLS certificate, we bind that public key to the server identity (could be anything, like admin email, we set that data when creating certificate.) That tls certificate therefore connects a public key and a server, and its sent to client, so client is aware of public key and knows it belongs to our server. <br>
Usually we use a certificate authority, tho we can make our own certificate too, <b>which we'll do here</b>. but when we do that, the browser does not trusts that info there is correct, and client can get warnings like this page uses ssl but doesn't seem to be secure. <br>
SO in production, we use a certificate provided by aa known certificate authority. <br>
Usually TLS is not free (might be free some where for static hosting)
https://stackoverflow.com/questions/52185560/heroku-set-ssl-certificates-on-free-plan

(See more about TLS (pinterest))

We will use openssl tool for creating certificates (available in linux by default)
```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```
will give pvt and public key packaged in certificate <br>
some options will be asked on terminal, must set common name to localhost rn, it has to be set to our domain (if we used this self signed cert on the server we deploy to, and we host it on example.com, then example.com needs to be typed here). 2 new files server.cert and server.key (pvt key) are added.

Not pushing server.key and server.cert to github, tho can push server.cert