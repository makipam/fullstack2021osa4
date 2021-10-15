const lod = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.map(x => x.likes).reduce((x,y) => x+y)
}

const favoriteBlog = (blogs) => {
	let mostLikes = 0 
	blogs.map(x => x.likes).forEach(amount => {
		if (amount > mostLikes) {
			mostLikes = amount
		} 
	}
	)
	const result = blogs.find(x => x.likes === mostLikes)
	const resultObject = (({title, author, likes}) => ({title, author, likes}))(result)
	return resultObject

}

const mostBlogs = (blogs) => {
	const collection = lod.countBy(blogs, (x => x.author))
	let result = lod.chain(collection)
		.map((val, key) => {
			return { author: key, blogs: val }
		})
		.sortBy('blogs')
		.reverse()
		.keyBy('author')
		.mapValues('blogs')
		.value()
	const cey = Object.keys(result)[0]
	const value = Object.values(result)[0]
	const final = {
		author: cey,
		blogs: value}
	return final
}

const mostLikes = (blogs) => {
	const newCollection = []
	blogs.forEach((x) => {
		newCollection.push((({author, likes}) => ({author, likes}))(x))
	})
	const result = lod.groupBy(newCollection, x => x.author)
	const col = []
	for (var x in result) {
		var value = result[x]
		var ok = lod.sumBy(value, x => x.likes)
		var obj = {
			'author': x,
			'likes': ok
		}
		col.push(obj)
	}
	const arr = lod.sortBy(col, 'likes').reverse()

	return arr[0]
}
  
module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}