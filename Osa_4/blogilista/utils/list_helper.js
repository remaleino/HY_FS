//4.3
const dummy = (blogs) => {
    return 1
}
//4.4
const totalLikes = (array) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return array.reduce(reducer, 0)
}
//4.5
const favoriteBlog = (array) => {
    const reducer = (acc, item) => {
        if (acc.likes < item.likes) {
            acc.title = item.title
            acc.author = item.author
            acc.likes = item.likes
        }
        return acc
    }
    return array.reduce(reducer, { title: '', author: '', likes: 0 })
}
//4.6
const mostBlogs = (array) => {
    const countedAuthors = array.reduce((arr, item) => {
        console.log(`arr: ${arr.author}`)
        console.log(`item: ${item.author}`)
        return {
            ...arr,
            author: item.author,
        }
    }, {})
    return countedAuthors
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}