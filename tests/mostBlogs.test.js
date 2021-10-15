const listHelper = require('../utils/list_helper')

const blog1 = {
	_id: '5a422aa71b54a676234d17f8',
	title: 'Go To Statement Considered Harmful',
	author: 'jaappeli juu',
	url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
	likes: 10,
	__v: 0
}

const blog2 = {
	_id: '5a422aa71b54a676234417f8',
	title: 'Go To Statement idered Harmful',
	author: 'Edsger W. Dijkstra',
	url: 'http://www.u.arizona.edu/~rubinson/coright_violations/Go_To_Considered_Harmful.html',
	likes: 3,
	__v: 0
}

const blog3 = {
	_id: '5a422aa71b54a676234d17f8',
	title: 'Go To Staent Considered Harmful',
	author: 'Edsger Wja',
	url: 'http://www.u.arizona.du/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
	likes: 10,
	__v: 0
}

const blog4 = {
	_id: '5a432aa71b54a676234d17f8',
	title: 'Go To Considered Harmful',
	author: 'Edsger W. Dijkstra',
	url: 'http://www.u.arizona.du/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
	likes: 4,
	__v: 0
}

const blog5 = {
	_id: '5a432aa7wb54a676234d17f8',
	title: 'Go To Considered Harmful',
	author: 'jee jii',
	url: 'http://www.u.arizona.du/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
	likes: 4,
	__v: 0
}

describe('most blogs', () => {
	const listWithOneBlog = [
		blog1
	]

	const listWithFiveBlogs = [
		blog1,
		blog2,
		blog3,
		blog4,
		blog5
	]
  
	test('when list has only one blog it is the author of the blog', () => {
		const result = listHelper.mostBlogs(listWithOneBlog)
		const answer = {
			author: blog1.author,
			blogs: 1}
		expect(result).toEqual(answer)
	})

	test('when list has five blogs equals the author with most blogs', () => {
		const result = listHelper.mostBlogs(listWithFiveBlogs)
		const answer = {
			author: blog4.author,
			blogs: 2}
		expect(result).toEqual(answer)
	})
})