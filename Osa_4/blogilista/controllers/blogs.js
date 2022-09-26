const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
    //4.17
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})
blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)

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