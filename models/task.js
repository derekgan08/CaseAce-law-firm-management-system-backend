const mongoose = require('mongoose');
const { Schema } = mongoose

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['todo', 'in_progress', 'done'],
        default: 'todo'
    },
    assignedBy: {
        type: String,
        ref: 'User',
    },
    assignedTo: {
        type: [{
            userId: {
                type: String,
                ref: 'User'
            },
            status: String
        }]
    },
    deadline: {
        type: String,
    },
    taskAssignedDate: {
        type: String,
        default: String.now
    },
    acceptanceCriteria: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;