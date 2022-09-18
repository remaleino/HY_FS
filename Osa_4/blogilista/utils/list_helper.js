const dummy = (blogs) => {
    return 1
}
const totalLikes = (array) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return array.reduce(reducer, 0)
}
const favoriteBlog = (array) => {
    //
}
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}