# Has 20 (till upload), 21 module rn

Left out parts will be done later

## Uploading images

-> express.urlencoded is a parser that parses requests for text. multer is a parser which parses for both text and files.

-> In the form where img is to be uploaded, we changed html enctype from default application/x-www-form-urlencoded to multipart/form-data

-> mimetype is like extension

-> files should not be directly stored in db but on a filesystem (we're storing them in an images folder here), they're too big.

-> Here we're storing the image path of my os in the db.

-> In edit product, if image picker is no file chosen (or invalid image is chosen), then we want to have the same image, otherwise overwrite.

-> / added in `<img src="/<%= product.imageUrl %>" alt="<%= product.title %>">` in admin products page as earlier this page is loaded in an admin controller in admin route, so /admin gets added to the url, but now with / added, the path will not be relative, but absolute, so /admin wont be there in path. So it can be added too in shop products and index page, but not added yet (as the route doesnt get added anything there)

## Pagination

There are many 3rd party packages available for this, but here we'll do it from scratch.

-> When using MongoDB, you can use skip() and limit() as shown 

Here's how you would implement pagination in SQL code: https://stackoverflow.com/questions/3799193/mysql-data-best-way-to-implement-paging

To quickly sum it up: The LIMIT command allows you to restrict the amount of data points you fetch, it's your limit() equivalent. Combined with the OFFSET command (which replaces skip()), you can control how many items you want to fetch and how many you want to skip.

When using Sequelize, the official docs describe how to add pagination: https://sequelize.org/master/manual/model-querying-basics.html

-> Not added pagination in admin pages