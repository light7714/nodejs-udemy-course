exports.getPosts = (req, res, next) => {
	//converts js obj to json, sends it with correct headers (content-type) (here it'll be application/json)
	res.status(200).json({
		posts: [
			{
				title: 'First Post',
				content: 'This is the first post!',
			},
		],
	});
};

//not using put, as for multiple posts we might append too (put-> create or overwrite a resource, post->adding, appending)
//could also have named postPost
exports.createPost = (req, res, next) => {
	const title = req.body.title;
	const content = req.body.content;
	//create post in db
	//201 ->  success + a resource was created
	res.status(201).json({
		message: 'Post created successfully',
		post: {
			id: new Date().toISOString(),
			title: title,
			content: content,
		},
	});
};
