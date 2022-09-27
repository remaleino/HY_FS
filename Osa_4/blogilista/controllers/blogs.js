const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    //4.17
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}
blogsRouter.post('/', async (request, response) => {
    const body = request.body
    //4.19
    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    console.log(decodedToken.id)
    if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    function hasProperty(props) {
        return Object.prototype.hasOwnProperty.call(body, props)
    }
    if (hasProperty('url') && hasProperty('title')) {
        const newBlog = new Blog({
            title: body.title,
            author: body.author === undefined ? '' : body.author,
            url: body.url,
            user: user._id
        })
        const savedBlog = await newBlog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.status(201).json(savedBlog)
    } else {
        response.status(400).end()
    }

})
blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})
blogsRouter.delete('/:id', async (req, res) => {
    const result = await Blog.findByIdAndRemove(req.params.id)
    if (result) {
        res.status(204).end()
    } else {
        console.log('here')
        res.status(404).end()
    }
})
blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const uBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    if (body.title === '') {
        res.status(400).end()
    } else {
        const blog = await Blog.findByIdAndUpdate(req.params.id, uBlog, { new: true, runValidators: true, context: 'query' })
        res.json(blog)
    }
})
module.exports = blogsRouter