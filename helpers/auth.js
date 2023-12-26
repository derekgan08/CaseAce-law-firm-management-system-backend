const bcrypt = require('bcrypt')

const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(12, (e, salt) => {
            if (e) reject(e)
            bcrypt.hash(password, salt, (e, hash) => {
                if (e) reject(e)
                resolve(hash)
            })
        })
    })
}

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}

module.exports = { hashPassword, comparePassword }