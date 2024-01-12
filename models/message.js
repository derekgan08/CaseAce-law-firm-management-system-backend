const mongoose = require('mongoose');
const { Schema } = mongoose

const validateArrayLength = (value) => {
    if (!Array.isArray(value) || value.length == 0) {
        return false;
    }
    return true
}
// Schema
const messageSchema = new Schema({
    message_list: {
        type: [
            {
                message_sender_id: {
                    type: String,
                },
                message_sender_name: {
                    type: String,
                },
                message_sender_avatar: {
                    type: String,
                },
                message_type: {
                    type: String,
                },
                message: {
                    type: String,
                },
                message_sent_date: {
                    type: String,
                },
            }],
    },
    message_case_id: {
        type: String,
    },
})

// Model
const messageModel = mongoose.model('message', messageSchema);

module.exports = messageModel