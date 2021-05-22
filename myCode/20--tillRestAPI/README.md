# Has 20 (till upload), 21 module rn

Left out parts will be done later

## Uploading images

-> express.urlencoded is a parser that parses requests for text. multer is a parser which parses for both text and files.

-> In the form where img is to be uploaded, we changed html enctype from default application/x-www-form-urlencoded to multipart/form-data

-> mimetype is like extension

-> files should not be directly stored in db but on a filesystem (we're storing them in an images folder here), they're too big.

-> Here we're storing the image path of my os in the db.

-> In edit product, if image picker is no file chosen (or invalid image is chosen), then we want to have the same image, otherwise overwrite.

-> Did some little things differently in 9th vid.
