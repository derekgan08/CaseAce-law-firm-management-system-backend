const getUserInfo = (res) => {
    return res.locals.decodedToken
}

module.exports = getUserInfo