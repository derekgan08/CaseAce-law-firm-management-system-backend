const multer = require('multer')
const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController')
const {requireAuth} = require('../middlewares/authMiddleware')
const upload = multer({ dest: 'uploads/' })

router.get('/', requireAuth, crmController.listUser) // get list of users
router.get('/employee', requireAuth, crmController.listEmployee) // get list of users
router.get('/:id', requireAuth, crmController.listSelectedUser) // get only selected users

router.post('/', requireAuth, crmController.createUser) // create new user
router.put('/p', requireAuth, crmController.updatePassword) // update password
router.put('/u/:id', requireAuth, upload.single('avatar_url'), crmController.updateUser) // update user with avatar
router.put('/:id', requireAuth, crmController.updateUser) // update user
router.delete('/:id', requireAuth, crmController.deleteUser) // delete a user

module.exports = router;