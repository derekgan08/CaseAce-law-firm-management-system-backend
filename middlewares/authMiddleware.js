const jwt = require('jsonwebtoken');
const { DoNotHaveAccessError } = require('../helpers/exceptions');
const getUserInfo = require('../helpers/getUserInfo');

const requireAuth = (req, res, next) => {
    const { token } = req.cookies
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, decodedToken) => {
            if (err) {
                var code = 401
                var errorInfo = "Unauthorized Access"
                res.status(code).send({
                    status: code,
                    info: errorInfo,
                    error_code: code,
                    message: errorInfo,
                });
            }
            else {
                res.locals.decodedToken = decodedToken
                next()
            }
        })
    } else {
        var code = 401
        var errorInfo = "Unauthorized Access"
        res.status(code).send({
            status: code,
            info: errorInfo,
            error_code: code,
            message: errorInfo,
        });
    }
}

const requireLawyerAndAdmin = (req, res, next) => {
    const { type } = getUserInfo(res)
    try {
        if (type === "client") {
            throw new DoNotHaveAccessError("User do not have access to perform such action")
        }
        next()
    } catch (error) {
        res.status(400).json({
            error: error.name,
            message: error.message
        })
    }
}

const requireAdmin = (req, res, next) => {
    const { type } = getUserInfo(res)
    try {
        if (type !== "admin") {
            throw new DoNotHaveAccessError("User do not have access to perform such action")
        }
        next()
    } catch (error) {
        res.status(400).json({
            error: error.name,
            message: error.message
        })
    }
}

module.exports = { requireAuth, requireLawyerAndAdmin, requireAdmin }