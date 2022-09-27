const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
describe('getting correct blogs', () => {
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
})
describe('adding a valid blog', () => {
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
    test('if an object is without likes, 0 likes are added', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const definedLikes = { likes: 0 }
        for (let blog of blogsAtStart) {
            if (blog.likes === undefined) {
                await api
                    .put(`/api/blogs/${blog.id}`)
                    .send(definedLikes)
                    .expect(200)
                    .expect('Content-Type', /application\/json/)
            }
        }
        const blogsAtEnd = await helper.blogsInDb()
        for (let blog of blogsAtEnd) {
            expect(blog.likes).toBeDefined()
        }
    })
    //4.12
    test('without a title or url blogs are not added', async () => {
        const newBlog = {
            title: 'test',
            author: 'test',
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })
})
//4.13
describe('testing the deletation of blogs', () => {
    test('if the deletion is successful, a status code 204 is returned', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blog = blogsAtStart[0]
        console.log(blog.id)
        await api
            .delete(`/api/blogs/${blog.id}`)
            .expect(204)
    })
    test('a wrong id causes and an error 404', async () => {
        const fakeId = '632d9730ea3520193463b265'
        await api
            .delete(`/api/blogs/${fakeId}`)
            .expect(404)
    })
})
//4.14
describe('Updating information of the blog', () => {
    test('the title cannot be changet to an empty line', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogId = blogsAtStart[0].id
        const newTitle = { title: '' }
        await api
            .put(`/api/blogs/${blogId}`)
            .send(newTitle)
            .expect(400)

    })
    test('a successful updating sends the status code 200', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogId = blogsAtStart[0].id
        const newTitle = { title: 'New title' }
        await api
            .put(`/api/blogs/${blogId}`)
            .send(newTitle)
            .expect(200)
    })
})

describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })
        await user.save()
    })
    //4.16
    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mmeikalainen',
            name: 'Matti Meikalainen',
            password: 'salasana'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    })
    test('a new user is not added, if username already exicts', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'testi',
            password: 'salasana'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
    test('a new user is not added, if a password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mmeikalainen',
            name: 'testi',
            password: 'sa'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})