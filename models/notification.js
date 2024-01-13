const mongoose = require('mongoose');
const { Schema } = mongoose

const validateArrayLength = (value) => {
    if (!Array.isArray(value) || value.length == 0) {
        return false;
    }
    return true
}
// Schema
const notificationSchema = new Schema({
    notification_type: {
        type: String,
    },
    notification_status: {
        type: String,
    },
    notification: {
        type: String,
    },
    notification_clicklink: {
        type: String,
    },
    notification_sent_date: {
        type: String,
    },
    notification_recipient_id_and_status: {
        type: [
            {
                recipient_id: String,
                status: String
            }],
    },
})

// Model
const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = notificationModel