const fs = require('fs')
const getUserInfo = require('../helpers/getUserInfo');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError, PasswordNotSameError } = require('../helpers/exceptions');
const validator = require('validator');
const User = require('../models/user');
const mongoose = require('mongoose');
const { promisify } = require('util')
const Case = require('../models/case');
const googleDrive = require('../utils/googleDrive'); // Import the new module
const unlinkAsync = promisify(fs.unlink)
const { userInfo } = require('os');
const { cloudinary } = require('../config/cloudinary');
const { hashPassword, comparePassword } = require('../helpers/auth')

const createUser = async (req, res) => {
    // const {_id} = getUserInfo(res)
    const {
        username,
        email,
        password,
        avatar_url,
        type
    } = req.body

    try {
        const new_user = new User({
            username,
            email,
            password,
            avatar_url,
            type
        });

        const new_entered_user = await new_user.save();

        if (!new_entered_user) {
            return res.json({
                error: 'No User uploaded'
            })
        }

        return res.status(200).send(new_user)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors) {
                if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value"))
                    validationErrors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        }
    }

}

const readUser = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id } = req.params
    try {

        // findandupdate
        const requestedUser = await User.findByIdAndUpdate(new mongoose.Types.ObjectId(id),
            {
                "$push":
                {
                    "last_accessed_at": {
                        "userId": userId,
                        "type": type,
                        "action": "view",
                        "access_date_time": Date.parse(Date.now())
                    }
                }
            }, { new: true }
        )
        if (!requestedUser)
            throw new DataNotExistError("User not exist")

        // update the doc

        return res.status(200).send({ ...requestedUser.user, canEdit: type === "admin" })
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const listSelectedUser = async (req, res) => {
    let { id } = req.params
    const { userId, type } = getUserInfo(res)
    id = id === "self" ? userId : id
    try {
        const selectedUser = await User.findById(new mongoose.Types.ObjectId(id));
        if (!selectedUser)
            throw new DataNotExistError("User does not exist")

        return res.status(200).send(selectedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const listUser = async (req, res) => {
    try {
        const allUser = await User.find({ type: "client" })

        if (!allUser)
            throw new DataNotExistError("User does not exist")

        return res.status(200).send(allUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const listEmployee = async (req, res) => {
    try {
        const allUser = await User.find({ type: {$ne: "client"} })

        if (!allUser)
            throw new DataNotExistError("User does not exist")

        return res.status(200).send(allUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const updateUser = async (req, res) => {
    let { id } = req.params
    const { userId, type } = getUserInfo(res)
    id = id === "self" ? userId : id
    let user_avatar;

    const selectUserID = type === "admin" ? id : userId;
    if (req.file) {
        const cloudinaryUploadedImage = await cloudinary.uploader.upload(req.file.path);
        user_avatar = cloudinaryUploadedImage.url;
        await unlinkAsync(req.file.path)
    }


    const {
        username,
        email,
        number,
        address,
    } = req.body

    const update = {
        username,
        email,
        type: req.body.type,
        number,
        address,
    }

    if (req.file) {
        update.avatar_url = user_avatar
    }
    console.log(update);
    try {

        const selectedUser = await User.findByIdAndUpdate(selectUserID,
            update, { new: true }
        )

        if (!selectedUser) {
            throw new DataNotExistError("User not exist")
        }

        return res.status(200).send(selectedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const updatePassword = async (req, res) => {
    const { userId } = getUserInfo(res)

    const selectUserID = userId;

    const {
        oldpassword, newpassword
    } = req.body

    try {

        const hashedOldPassword = await hashPassword(oldpassword)
        const hashedNewPassword = await hashPassword(newpassword)

        /**
         * 
         * const uU = User.fOAU({
         *  _id : selectUserID,
         * password: 
         * }, update)
         */
        const user = await User.findOne({ _id: new mongoose.Types.ObjectId(selectUserID) });
        if (!user) {
            return res.json({
                error: 'No user found'
            })
        }

        const match = await comparePassword(oldpassword, user.password)

        if (!match) {
            throw new PasswordNotSameError("Password Not Same")
        }
        else {
            const updatedUser = await User.findOneAndUpdate({
                _id: new mongoose.Types.ObjectId(selectUserID)
            }, { password: hashedNewPassword })

            if (!updatedUser) {
                throw new PasswordNotSameError("Password Not Same")
            }

            return res.status(200).send(updatedUser)
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const deleteUser = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id } = req.params

    const selectUserID = type === "admin" ? id : userId;

    try {

        const deletedUser = await User.findByIdAndDelete(selectUserID)
        if (!deletedUser)
            throw new DataNotExistError("User does not exist")

        return res.status(200).send(deletedUser)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

module.exports = {
    createUser, listSelectedUser, listUser, updateUser, deleteUser, updatePassword, listEmployee
};