const mongoose = require('mongoose');
const User = require('../models/user');
const Task = require('../models/task'); // Import the Task model
const getUserInfo = require('../helpers/getUserInfo');
const saveNotifications = require('../helpers/saveNotification');

// 创建任务
const createTask = async (req, res) => {
    const nowDate = new Date();
    var yyyy = nowDate.getFullYear().toString();
    var mm = (nowDate.getMonth() + 1).toString();
    var dd = nowDate.getDate().toString();

    var mmChars = mm.split('');
    var ddChars = dd.split('');

    var assignedDateTdy = yyyy + '-' + (mmChars[1] ? mm : "0" + mmChars[0]) + '-' + (ddChars[1] ? dd : "0" + ddChars[0]);
    try {
        const { userId, type, name } = getUserInfo(res)
        const { title, description, status, assignedTo, deadline, acceptanceCriteria } = req.body;
        const assignedToId = []
        assignedTo.forEach((pair) => {
            pair['userId'] = pair['name']
            assignedToId.push(pair['userId'])
            pair['status'] = pair['response']
            delete pair['name']
            delete pair['response']
        })

        const task = new Task({
            title,
            description,
            status,
            assignedBy: userId,
            assignedTo,
            deadline: deadline,
            taskAssignedDate: assignedDateTdy,
            acceptanceCriteria
        });
        const newTask = await task.save();
        await saveNotifications(`${name} has assigned a new task for you: ${title}`, assignedToId, "assignedTask", `/php/task`)

        res.status(200).json(newTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取所有任务
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const retrieveAllUsersExceptCurrentUser = async (excludeName) => {
    try {
        // Use the find method to retrieve all user names excluding the specified name
        const allUsers = await User.find({}, 'username');//username: { $ne: excludeName }
        // Extract the names from the result
        const userNames = allUsers //.map(user => user.username);

        return userNames;
    } catch (error) {
        throw new Error(`Error retrieving user names: ${error.message}`);
    }
}

const getUserList = async (req, res) => {
    try {

        const { name } = getUserInfo(res);    // Get the user's name from cookies token

        const userNames = await retrieveAllUsersExceptCurrentUser(name);  // Get all usernames except the current user

        return res.json(userNames);           // Send the response with the user list

    } catch (error) {
        return res.status(400).json({
            error: 'Error sending user list to frontend:',
            message: error.message
        });
    }
};

// 获取某个律师的所有任务
const getTasksForUser = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    console.log(userId);
    try {
        const allUser = []
        const tasks = await Task.find({ "assignedTo.userId": userId, });
        tasks.forEach((task) => {
            // if(!(task.assignedBy in allUser)){
            //     allUser.push((task.assignedBy))
            // }
            task.assignedTo.forEach(assignedToId => {
                if (!(assignedToId.userId) in allUser) {
                    allUser.push((assignedToId.userId))
                }
            })
        })

        allUser.map((uid) => {
            return (new mongoose.Types.ObjectId(uid))
        })

        const users = await User.find({
            _id: {
                $in: allUser
            }
        }, ['username', 'avatar_url'])

        users.forEach((user) => {
            user._id = String(user._id)

        })

        const test = await Task.aggregate([
            {
                $match: {
                    'assignedTo.userId': userId
                }
            },
            {
                $addFields: {
                    assignedByObjectId: {
                        $toObjectId: '$assignedBy', // Convert assignedBy from string to ObjectId
                    },
                    assignedToObjectId: {
                        $map: {
                            input: '$assignedTo',
                            as: 'assignedToUser',
                            in: {
                                userId: {
                                    $toObjectId: '$$assignedToUser.userId', // Convert assignedTo.userId from string to ObjectId
                                },
                                status: '$$assignedToUser.status',
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: 'assignedByObjectId',
                    foreignField: '_id',
                    as: 'assignedByUser'
                }
            },
            {
                $unwind: '$assignedByUser'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedToObjectId.userId',
                    foreignField: '_id',
                    as: 'assignedToUsers'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    assignedByUser: {
                        _id: '$assignedByUser._id',
                        username: '$assignedByUser.username',
                        avatar_url: '$assignedByUser.avatar_url'
                    },
                    assignedToUsers:
                    {
                        $map: {
                            input: '$assignedToUsers',
                            as: 'assignedToUser',
                            in: {
                                username: '$$assignedToUser.username',
                                avatar_url: '$$assignedToUser.avatar_url'
                            }
                        }
                    },
                    deadline: 1,
                    assignedTo: 1,
                    assignedBy: 1,
                    taskAssignedDate: 1,
                    acceptanceCriteria: 1
                }
            }
        ])

        console.log(tasks);

        // for (const task of tasks) {
        //     const uploadUserId = task.assignedBy
        //     let uploadedByUserName = await User.findById(new mongoose.Types.ObjectId(uploadUserId)).select(['username', 'avatar_url']);

        //     const lastAccessUserId = task.assignedTo
        //     let lastAccessedByUserName = await User.find({_id: {
        //         $in: allUser
        //     }}).select(['username', 'avatar_url']);

        //     const relatedCaseId = doc.doc_case_related
        //     let relatedCaseName = await Case.findById(new mongoose.Types.ObjectId(relatedCaseId)).select('case_title');

        //     updatedCaseDocs.push({ ...doc._doc, uploadedByUserName, lastAccessedByUserName, relatedCaseName })
        // }

        console.log(test);
        res.status(200).json(test);
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};

// 获取单个任务
const getTask = async (req, res) => {
    try {
        const task = await Task.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.id)
                }
            },
            {
                $addFields: {
                    assignedByObjectId: {
                        $toObjectId: '$assignedBy', // Convert assignedBy from string to ObjectId
                    },
                    assignedToObjectId: {
                        $map: {
                            input: '$assignedTo',
                            as: 'assignedToUser',
                            in: {
                                userId: {
                                    $toObjectId: '$$assignedToUser.userId', // Convert assignedTo.userId from string to ObjectId
                                },
                                status: '$$assignedToUser.status',
                            },
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: 'users', // The name of the User collection
                    localField: 'assignedByObjectId',
                    foreignField: '_id',
                    as: 'assignedByUser'
                }
            },
            {
                $unwind: '$assignedByUser'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'assignedToObjectId.userId',
                    foreignField: '_id',
                    as: 'assignedToUsers'
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    status: 1,
                    assignedByUser: {
                        _id: '$assignedByUser._id',
                        username: '$assignedByUser.username',
                        avatar_url: '$assignedByUser.avatar_url'
                    },
                    assignedToUsers:
                    {
                        $map: {
                            input: '$assignedToUsers',
                            as: 'assignedToUser',
                            in: {
                                username: '$$assignedToUser.username',
                                avatar_url: '$$assignedToUser.avatar_url'
                            }
                        }
                    },
                    deadline: 1,
                    assignedTo: 1,
                    assignedBy: 1,
                    taskAssignedDate: 1,
                    acceptanceCriteria: 1
                }
            }
        ])
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 检查当前用户是否有权限查看该任务
        // const currentUser = req.user; // 从 req.user 中获取当前用户
        // if (String(task.assignedTo) !== String(currentUser._id)) {
        //     return res.status(403).json({ error: 'You do not have permission to view this task' });
        // }
        res.status(200).json(task[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateStatus = async (req, res) => {
    const { _id } = req.body
        const { userId, type, name } = getUserInfo(res)
        const status = req.params.status
    try {
        const task = await Task.findByIdAndUpdate(_id, { status });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        let notiMsg
        if(status === "working") notiMsg = "currently working on task assigned by you:"
        else if(status==="done") notiMsg = "finished task assigned by you:"
        else  notiMsg = "moved the task assigned by you back to TODO:"
        
        await saveNotifications(`${name} ${notiMsg} ${task.title}`, [task.assignedBy], "finishedTask", `/php/task`)

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// 更新任务
const updateTask = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    console.log(req.body);
    let { _id, title, details, status, assignedTo, dateStart, location, assignedToUsers } = req.body;
    assignedToUsers.forEach((pair) => {
        pair['userId'] = pair['name']
        pair['status'] = pair['response']
        delete pair['name']
        delete pair['response']
    })

    assignedTo = assignedToUsers


    // const { id, creator, title, lawyer, description, status, assignedBy, assignedTo, deadline, taskAssignedDate, acceptanceCriteria } = req.body;
    try {

        const updatedTask = {
            title,
            description: details,
            status,
            assignedBy: userId,
            assignedTo,
            deadline: dateStart,
            acceptanceCriteria: location
        };
        const newTask = await Task.findByIdAndUpdate(_id, updatedTask, { new: true });

        res.status(200).json(newTask);

        // const task = await Task.findByIdAndUpdate(_id, { creator, title, lawyer, description, status, assignedBy, assignedTo, deadline, taskAssignedDate, acceptanceCriteria }, { new: true });
        // if (!task) return res.status(404).json({ error: 'Task not found' });
        // res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 删除任务
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { createTask, getTasks, updateStatus, getTask, updateTask, deleteTask, getTasksForUser, getUserList };