const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})
blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)

})
blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})
blogsRouter.get('/:id', async (req, res) => {
    await Blog.findByIdAndRemove(req.params.id)
    res.status(204).end()
})
blogsRouter.put('/:id', async (req, res) => {
    const body = req.body
    const uBlog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, uBlog, { new: true, runValidators: true, context: 'query' })
    res.json(blog)
})
module.exports = blogsRouter