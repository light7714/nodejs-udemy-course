-> In mongoDb, we have databases, collections and documents.
<img src="README-files/noSQL_World.png" width="500" height="250" alt="Databases, collections and documents"> <br>

->It stores documents in JSON, or its own BSON precisely (Binary JSON, something to do with storage format and all) <br>

-> Using MongoDb Atlas, its a cloud version <br>

-> Also installed mongoDb Compass to see data(like mysql workbench)

-> Js file with mongodb atlas password is not exposed in github, you need to have that file before running the project <br>

-> the part after .net/ and before ? mark is the database name we wanna connect to in srv address. <br>

->We dont have to setup databases (or collection even) beforehand in mongoDb, like here we didnt create shop db anywhere still we are connecting to it. mongodb will automatically create one if it doesnt exist. we can also enter db name in client.db(); (like client.db('test')), and then it will connect to test db instead of the db name written in srv address, regardless of which db is written in srv address. <br>

-> _id is actually stored in mongodb as ObjectId type (a type existing due to BSON maybe) (can see in mongodb compass) so we cant just equate ObjectId  with a string (prodId in product.js)