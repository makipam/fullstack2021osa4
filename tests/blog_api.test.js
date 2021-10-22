const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helpers')

let correctToken = ''
beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('sekret', 10)
	const user = new User({ username: 'root', name: 'root', passwordHash })
	await user.save()

	const response = await api
		.post('/api/login/')
		.send({
			username: 'root',
			password: 'sekret'
		})

	correctToken = response.body.token
})


describe('When there is initially some blogs saved', () => {

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
			author: 'author2',
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${correctToken}`)
			.send(newBlog)
			.expect(400)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
	})

	test('a valid blog can be added ', async () => {
		const newBlog = {
			title: 'uusi blogi',
			author: 'authoriitta',
			url: 'www.jeejee',
			likes: 2
		}
  
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${correctToken}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)
  
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
  
		const titles = blogsAtEnd.map(r => r.title)
		expect(titles).toContain(
			'uusi blogi'
		)
	})

	test('a valid blog can not be added without a token', async () => {
		const newBlog = {
			title: 'extra uusi blogi',
			author: 'authoriitta',
			url: 'www.jeejee',
			likes: 2
		}
  
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/)
  
		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  
		const titles = blogsAtEnd.map(r => r.title)
		expect(titles).not.toContain(
			'extra uusi blogi'
		)
	})

	test('blog without likes will be added and the likes field will be 0', async() => {
		const newBlog = {
			title: 'yksi uusi blogi',
			author: 'author1',
			url: 'url1'
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${correctToken}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		const addedBlog = blogsAtEnd.find(x => x.title === 'yksi uusi blogi')
		expect(addedBlog.likes).toBe(0)
	}
	)

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

	test('a blog will be deleted if it was added by the user', async () => {
		const newBlog = {
			title: 'uusi blogi',
			author: 'authoriitta',
			url: 'www.jeejee',
			likes: 2
		}
  
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${correctToken}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAfterAdding = await helper.blogsInDb()
		const blogToDelete = blogsAfterAdding.find(x => x.title === 'uusi blogi')

  
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${correctToken}`)
			.expect(204)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length
		)
  
		const titles = blogsAtEnd.map(r => r.title)
  
		expect(titles).not.toContain(blogToDelete.title)
	})

	test('a blog will not be deleted if it was not added by the specific user', async () => {

		const passwordHash = await bcrypt.hash('sekret123', 10)
		const user1 = new User({ username: 'seconduser', name: 'second', passwordHash })
		await user1.save()

		const response = await api
			.post('/api/login/')
			.send({
				username: 'seconduser',
				password: 'sekret123'
			})

		const seconduserToken = response.body.token

		const newBlog = {
			title: 'taas uusi blogi',
			author: 'authtta',
			url: 'www.jeejee',
			likes: 2
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${seconduserToken}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtMid = await helper.blogsInDb()
		const blogToDelete = blogsAtMid.find(x => x.title === 'taas uusi blogi')
  
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${correctToken}`)
			.expect(401)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length + 1
		)
  
		const titles = blogsAtEnd.map(r => r.title)
  
		expect(titles).toContain(newBlog.title)
	})

	test('a blog will not be deleted without a token', async () => {
		const newBlog = {
			title: 'uusi blogi',
			author: 'authoriitta',
			url: 'www.jeejee',
			likes: 2
		}
  
		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${correctToken}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAfterAdding = await helper.blogsInDb()
		const blogToDelete = blogsAfterAdding.find(x => x.title === 'uusi blogi')

  
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(401)
  
		const blogsAtEnd = await helper.blogsInDb()
  
		expect(blogsAtEnd).toHaveLength(
			helper.initialBlogs.length + 1
		)
  
		const titles = blogsAtEnd.map(r => r.title)
  
		expect(titles).toContain(blogToDelete.title)
	})
})

afterAll(() => {
	mongoose.connection.close()
})