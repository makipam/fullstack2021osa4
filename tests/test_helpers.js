const Blog = require('../models/blog')

const initialBlogs = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'eka blogi',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 10,
		__v: 0
	},
	{
		_id: '5a422aa72b54a676234d17f8',
		title: 'toka blogi',
		author: 'Edsger',
		url: 'http://www.uzona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 14,
		__v: 0
	},
]

const nonExistingId = async () => {
	const blog = new Blog({ title: 'willremovethissoon', author: 'mm', url: 'www.juujuu', likes: 30 })
	await blog.save()
	await blog.remove()

	return blog._id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

module.exports = {
	initialBlogs, nonExistingId, blogsInDb
}