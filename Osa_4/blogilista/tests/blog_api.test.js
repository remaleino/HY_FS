const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})
test('there are two blogs', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.initialBlogs.length)
})
//4.8
test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')
    expect(res.body).toHaveLength(helper.initialBlogs.length)
})
//4.9
test('an id is defined in blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()
    for (let blog of blogsAtStart) {
        expect(blog.id).toBeDefined()
    }
})
//4.10
test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'test',
        author: 'test',
        url: 'test',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).toContain('test')
})
//4.11
test('if object is without likes, 0 likes are added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    for (let blog of blogsAtStart) {
        if (blog.likes === undefined) {
            console.log('yes')
        }
    }
})
test('note without id is not added', async () => {
    const newBlog = {
        title: 'id-test',
        author: 'test',
        url: 'test',
        likes: 1
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
})
test('a spesific note can be viewed', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToView = blogsAtStart[0]

    const resultBlog = await api
        .get(`/api/blog/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const processedBlogToView = JSON.parse(JSON.stringify(blogToView))
    expect(resultBlog.body).toEqual(processedBlogToView)
})
afterAll(() => {
    mongoose.connection.close()
})