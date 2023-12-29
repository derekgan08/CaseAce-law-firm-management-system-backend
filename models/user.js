const mongoose = require('mongoose');
const {Schema} = mongoose

// Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
    },
    number: {
        type: String,
        unique: true,
        required: [true, "Contact Number is required"],
    },
    address: {
        type: String,
        unique: true,
        required: [true, "Address is required"],
    },
    
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    avatar_url: {
        type: String,
        
    },
    type: {
        type: String,
        required: [true, "Type is required"],
    },
    rating: {
        type: {

        }
    }
})

// Model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel  