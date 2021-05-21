## Validation
Client side validation using js is good for UX (as when something wrong is entered, the old input is kept, and can be changed ... but it can be done using server side validation too.. so what helpful??) but is optional, as user can change that code, or disable js.

Built in database validation is also there in most dbs (like mongdodb) but its a last resort. We'll do server side validation here (most imp).

-> Usually we validate on non-get requests.

-> For more builtin validators, see docs (express-validator was a wrapper to validator.js, so see its docs)

## Sanitisation
Not focussing on XSS sanitisation rn

-> When we are on a page and validation errors occur there, then we pass those to the view rendered again, but we still need flash here (it was used in postReset after checking if email exists or not in db). In general, flash to be used when msgs need to persist with redirect.

### Note: not added validation to reset and new-password page in vids, and in my code too rn.