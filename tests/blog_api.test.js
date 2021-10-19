const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helpers')


describe('When there is initially some blogs saved', () => {
	beforeEach(async () => {
		await Blog.deleteMany({})
		await Blog.insertMany(helper.initialBlogs)
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('there are two blogs', async () => {
		const response = await api.get('/api/blogs')
	
		expect(response.body).toHaveLength(helper.initialBlogs.length)
	})
	
	test('the blogs contain a title "toka blogi"', async () => {
		const response = await api.get('/api/blogs')
		const titles = response.body.map(r => r.title)

		expect(titles).toContain(
			'toka blogi'
		)
	})

	test('the blogs have a field called id', async () => {
		const blogsAtStart = await helper.blogsInDb()
	
		const blogToView = blogsAtStart[0]

		expect(blogToView.id).toBeDefined()
	}) 
})

describe('Addition of a new blog', () => {

	test('blog without title and url is not added', async () => {
		const newBlog = {
			author: 'author2'
		}
  
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})

	test('blog without likes will be added and the likes field will be 0', async() => {
		const newBlog = {
			title: 'yksi uusi blogi',
			author: 'author1',
			url: 'url1'
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		const addedBlog = blogsAtEnd.find(x => x.title === 'yksi uusi blogi')
		expect(addedBlog.likes).toBe(0)
	}
	)

	test('a valid blog can be added ', async () => {
		const newBlog = {
			title: 'uusi blogi',
			author: 'authoriitta',
			url: 'www.jeejee',
			likes: 2
		}
  
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)
  
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 2)
  
		const titles = blogsAtEnd.map(r => r.title)
		expect(titles).toContain(
			'uusi blogi'
		)
	})

})

describe('Viewing of a specific blog', () => {


	test('a specific blog can be viewed', async () => {
		const blogsAtStart = await helper.blogsInDb()
  
		const blogToView = blogsAtStart[0]
  
		const resultBlog = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)
  
		const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
  
		expect(resultBlog.body).toEqual(processedBlogToView)
	})
})
  

describe('Deletion of a blog', () => {

	test('a blog can be deleted', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]
  
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length + 1
		)
  
		const titles = blogsAtEnd.map(r => r.title)
  
		expect(titles).not.toContain(blogToDelete.content)
	})
})

afterAll(() => {
	mongoose.connection.close()
})