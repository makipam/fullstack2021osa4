const listHelper = require('../utils/list_helper')

const blog1 = {
	_id: '5a422aa71b54a676234d17f8',
	title: 'Go To Statement Considered Harmful',
	author: 'Edsger W. Dijkstra',
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
	author: 'Edsger W. Dijkstra',
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


describe('favorite blog', () => {
	const listWithOneBlog = [
		blog1
	]

	const listWithThreeBlogs = [
		blog1,
		blog2,
		blog3,
		blog4
	]
  
	test('when list has only one blog it is the favorite', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog)
		const resultObject = (({title, author, likes}) => ({title, author, likes}))(blog1)
		expect(result).toEqual(resultObject)
	})

	test('when list has three blogs equals the one with most likes', () => {
		const result = listHelper.favoriteBlog(listWithThreeBlogs)
		const resultObject = (({title, author, likes}) => ({title, author, likes}))(blog1)
		expect(result).toEqual(resultObject)
	})
})