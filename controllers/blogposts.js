const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (_request, response) => {
	const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
	response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
	const body = request.body
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}
	const user = request.user

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.json(savedBlog.toJSON())
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog.toJSON())
	} else {
		response.status(404).end()
	}
})
  
blogRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	const decodedToken = jwt.verify(request.token, process.env.SECRET)

	if (!request.token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
	}

	const user = request.user

	if ( blog.user.toString() === user._id.toString() ) {
		await Blog.remove(blog)
		response.status(204).end()
	} else {
		return response.status(401).json({ error: 'blog you are trying to delete is not yours' })
	}
	
})

// eslint-disable-next-line no-unused-vars
blogRouter.put('/:id', async (request, response) => {
	const body = request.body
  
	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes
	}
  
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
	response.json(updatedBlog.toJSON())
})

module.exports = blogRouter