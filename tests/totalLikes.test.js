const listHelper = require('../utils/list_helper')

describe('total likes', () => {
	const listWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithThreeBlogs = [
		{
			_id: '5a422aa71b54a676237d17f8',
			title: 'Go To Statement Considere Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234417f8',
			title: 'Go To Statement idered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/coright_violations/Go_To_Considered_Harmful.html',
			likes: 3,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Staent Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.du/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 9,
			__v: 0
		}
	]
  
	test('when list has only one blog equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog)
		expect(result).toBe(5)
	})

	test('when list has three blogs equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithThreeBlogs)
		expect(result).toBe(17)
	})
})