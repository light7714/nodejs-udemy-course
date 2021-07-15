Deploying (my) SSR code here

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
