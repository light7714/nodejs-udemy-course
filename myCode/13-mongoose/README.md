-> No need to do anything with mongoose in database.js, it manages connection and so on behind the scenes automatically (so deleting database.js), so no need of mongodb driver as well <br>

-> Depreciation warnings and solutions: https://mongoosejs.com/docs/deprecations.html <br>
-> To fix all deprecation warnings, follow the below steps:

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
Replace update() with updateOne(), updateMany(), or replaceOne()
Replace remove() with deleteOne() or deleteMany().
Replace count() with countDocuments(), unless you want to count how many documents are in the whole collection (no filter). In the latter case, use estimatedDocumentCount().
<br>

-> MongoDb is schemaless, but here we're defining schemas. We're doing this as we often have a certain structure with the data we work with, and mongoose offers us advantage of just focussing on our data and not on queries, but for that it needs to know how the data looks like. But we can still deviate after setting schema and not setting certain attributes in an object later (if required flag is not false),

-> \_id will still be added automatically, another attribute **v (version key) is also added. https://stackoverflow.com/questions/12495891/what-is-the-v-field-in-mongoose#:~:text=The%20versionKey%20is%20a%20property,The%20default%20is%20**v%20.

-> Mongoose can work with both promises and callbacks

-> **IMP** Mongoose queries are not promises. They have a .then() function for co and async/await as a convenience. If you need a fully-fledged promise, use the .exec() function. https://mongoosejs.com/docs/promises.html
