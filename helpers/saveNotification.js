const fs = require('fs')
const { ServerError } = require('../helpers/exceptions');
const Notification = require('../models/notification');
const User = require('../models/user');

const saveNotifications = async (message, recipientIds, notiType, clickTo) => {

    const idStatusArray = []

    recipientIds.forEach((recipient_id)=>{
        idStatusArray.push({recipient_id, status: "unread"})
    })

    const new_noti = new Notification({
        notification_type: notiType,
        notification_status: "sent",
        notification: message,
        notification_clicklink: clickTo,
        notification_sent_date: Date.now(),
        notification_recipient_id_and_status: idStatusArray,
    });
    console.log("5");

    const noti = await new_noti.save();
    if (!noti) {
        console.log("6");

        throw new ServerError("Notification not sent")
    }
}

module.exports = saveNotifications