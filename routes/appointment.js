const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { requireAuth } = require('../middlewares/authMiddleware')

// To get the appointments for displaying in website
router.get('/', requireAuth, appointmentController.getAppointments);

// To create a new appointment nad store in database
router.post('/', requireAuth, appointmentController.createAppointment);

// To check the user's role
router.get('/isAdmin', requireAuth, appointmentController.checkUserType);

// To get other user's name list for options
router.get('/userlist', requireAuth, appointmentController.getUserList);

// To get a particular appointment based on the id
router.get('/:id', requireAuth, appointmentController.getSpecificAppointment);

// To update a particular appointment based on the id
router.put('/:id', requireAuth, appointmentController.updateAppointment);

// To cancel the appointment based on the id
router.delete('/:id', requireAuth, appointmentController.cancelAppointment);

// To update the user response to the appointment
router.put('/response/:id', requireAuth, appointmentController.updateUserResponse);




module.exports = router;