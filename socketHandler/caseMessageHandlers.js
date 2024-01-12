let collectedUserInfo = {};
let messageBatch = {};

const User = require('../models/user')
const mongoose = require('mongoose');
const Message = require('../models/message')


const caseMessageHandlers = (io, socket) => {

    const joinRoom = (caseId) => {
        socket.join(caseId);
        console.log(`User joined room: ${caseId}`);
    }

    const chatMessage = async (data) => {
        // Broadcast the message to everyone in the case room
        const currentUserId = socket.decoded.userId
        if (!collectedUserInfo[currentUserId]) {
            collectedUserInfo[currentUserId] = await User.findById(new mongoose.Types.ObjectId(currentUserId))
        }

        io.to(data.caseId).emit('message', data)
        const messagebody = {
            message_sender_id: currentUserId,
            message_sender_name: collectedUserInfo[currentUserId].username,
            message_sender_avatar: collectedUserInfo[currentUserId].avatar_url,
            message_type: data.type,
            message: data.message,
            message_sent_date: (Date.now())
        }
        if (!messageBatch[data.caseId]) {
            messageBatch[data.caseId] = [messagebody]
        } else {
            messageBatch[data.caseId].push(messagebody)
        }
    }

    const disconnect = () => {
        console.log('User disconnected');
    }

    // Handling joining a case room
    socket.on('joinRoom', joinRoom);

    // Handling chat messages
    socket.on('chatMessage', chatMessage);

    // Handling disconnect
    socket.on('disconnect', disconnect);
}

// Write the message batch to MongoDB
const writeMessageBatchToDB = () => {
    if (Object.keys(messageBatch).length > 0) {
   
      for (const cid of Object.keys(messageBatch)) {
        const messageEachCase = messageBatch[cid]
        const filter = {
          "message_case_id": cid,
        }
        const newMessages = Message.findOneAndUpdate(filter, {
          "$push":
          {
            "message_list": [...messageEachCase]
          }
        }, { new: true, upsert: true }).then(() => {
          console.log('Batch written to MongoDB');
          // Clear the batch after writing
          messageBatch = {};
        })
          .catch((err) => {
            console.error('Error writing batch to MongoDB:', err);
          });
      }
  
    }
  }

module.exports =
    {caseMessageHandlers, writeMessageBatchToDB}

