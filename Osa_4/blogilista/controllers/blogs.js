const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
blogsRouter.post('/', async (request, response) => {
    const blog = request.body
    function hasProperty(props) {
        return Object.prototype.hasOwnProperty.call(blog, props)
    }
    if (hasProperty('url') && hasProperty('title')) {
        const newBlog = new Blog(blog)
        const savedBlog = await newBlog.save()
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