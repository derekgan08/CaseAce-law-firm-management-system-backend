const { DataNotExistError } = require('../helpers/exceptions');
const getUserInfo = require('../helpers/getUserInfo');
const Appointment = require('../models/appointment');
const User = require('../models/user');
const saveNotifications = require('../helpers/saveNotification');


// Filter the appointments based on username
const filterAppointments = (allAppointments, username) => {
  const appointments = allAppointments.filter(appointment =>
    (appointment.creator === username ||    // If the user is creator or attendee of an appointment
    appointment.attendees.some(attendee => attendee.name === username)) && // And
    appointment.status === 'scheduled'      // If the appointment is scheduled (not cancelled)
  );

  return appointments;
}


// To retrieve all appointments from database
const retrieveAllAppointments = async () => {
  try {
    // Use the find method to retrieve all appointments
    const allAppointments = await Appointment.find({});

    return allAppointments;
  } catch (error) {
    throw new Error(`Error retrieving appointments: ${error.message}`);
  }
};


// To retrieve the appointment based on id from database
const retrieveAppointmentByID = async (appointmentID) => {
  try {
    // Use the findById method to retrieve the appointment by _id
    const appointment = await Appointment.findById(appointmentID);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  } catch (error) {
    throw new Error(`Error retrieving specific appointment: ${error.message}`);
  }
}


// Update the appointment object in the database
const updateAppointmentById = async (appointmentId, updatedAppointmentData) => {
  try {
    // Use the updateOne method to replace the appointment based on _id
    const result = await Appointment.updateOne(
      { _id: appointmentId },
      { $set: updatedAppointmentData }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    //return result;
  } catch (error) {
    throw new Error(`Error updating appointment: ${error.message}`);
  }
};


// Update the appointment object's status property only in the database
const updateAppointmentStatusById = async (appointmentId, newStatus) => {
  try {
    const result = await Appointment.updateOne(
      { _id: appointmentId },
      { $set: { status: newStatus } }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    // No need to return the result object if it's not used elsewhere
  } catch (error) {
    throw new Error(`Error updating appointment status: ${error.message}`);
  }
};


// Update the appointemnt object's attendee response only in the database
const updateAttendeeResponse = async (appointmentId, attendeeName, newResponse) => {
  try {
    const result = await Appointment.updateOne(
      { _id: appointmentId, 'attendees.name': attendeeName },
      { $set: { 'attendees.$.response': newResponse } }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    // No need to return the result object if it's not used elsewhere
  } catch (error) {
    throw new Error(`Error updating attendee response: ${error.message}`);
  }
};


// To retrieve all username except 1 user
const retrieveAllUsersExceptCurrentUser = async (excludeName) => {
  try {
    // Use the find method to retrieve all user names excluding the specified name
    const allUsers = await User.find({ username: { $ne: excludeName } }, 'username');

    // Extract the names from the result
    const userNames = allUsers.map(user => user.username);

    return userNames;
  } catch (error) {
    throw new Error(`Error retrieving user names: ${error.message}`);
  }
}


// To get the list of attendee from an appointment
const getListOfAttendees = (appointment) => {
  return appointment.attendees.map(attendee => attendee.name);
}


// To get the _id for each user from the username list
const getListOfUserID = async (usernameList) => {
  const resultsArray = [];

  // Use Promise.all to wait for all queries to complete
  await Promise.all(usernameList.map(async (username) => {
    try {
      const result = await User.findOne({ username }, '_id');
      
      if (result) {
        resultsArray.push(result._id);
      } else {
        console.log(`No matching document found for username: ${username}`);
      }
    } catch (error) {
      console.error(`Error querying for username ${username}:`, error);
    }
  }));

  return resultsArray;
}


// To get the appointment title and time used for part of message
const titleTimeMessage = (appointment) => {
  let time, sameDay, titleAndTime;

  // To check it has start time and end time
  if(appointment.timeStart === '' && appointment.timeEnd === '') {
    time = false;
  }
  else{
    time = true;
  }

  // To check it is same day or not
  if(appointment.dateStart === appointment.dateEnd){
    sameDay = true;
  }
  else{
    sameDay = false;
  }

  // To give the title, date and time (part of message)
  if(time){
    if(sameDay){
      titleAndTime = `${appointment.title} (${appointment.dateStart} ${appointment.timeStart} to ${appointment.timeEnd})`;
    }
    else{
      titleAndTime = `${appointment.title} (${appointment.dateStart} ${appointment.timeStart} to ${appointment.dateEnd} ${appointment.timeEnd})`;
    }
    
  }
  else{
    if(sameDay){
      titleAndTime =  `${appointment.title} (${appointment.dateStart})`;
    }
    else{
      titleAndTime = `${appointment.title} (${appointment.dateStart} to ${appointment.dateEnd})`;
    }
  }

  return titleAndTime;
}


// To generate message when creator do action to an appointment
const generateMessage = (appointment, messageType) => {
  
  const titleAndTime = titleTimeMessage(appointment);

  switch (messageType) {
    case "newAppointment":
      return `${appointment.creator} has sent a new appointment invitation to you: ${titleAndTime}`;
        
    case "updateAppointment":
      return `${appointment.creator} has updated the appointment: ${titleAndTime}`;
    
    case "removeAttendees":
      return `${appointment.creator} has removed you from the appointment: ${titleAndTime}`;
    
    case "cancelAppointment":
      return `${appointment.creator} has cancelled the appointment: ${titleAndTime}`;
    
    default:
      return "Wrong Appointment Message. Please report to administrator";
  }
}


// To send notification for updated appointment
const notificationForUpdateAppointment = async (appointment, commonAttendees, attendeesOnlyInOldList, attendeesOnlyInNewList) => {
  if(commonAttendees.length > 0){
    const attendeeListID = await getListOfUserID(commonAttendees);
    const message = generateMessage(appointment, "updateAppointment");
    await saveNotifications(message, attendeeListID, "updateAppointment", `/php/appointment`);
  }

  if(attendeesOnlyInOldList.length > 0){
    const attendeeListID = await getListOfUserID(attendeesOnlyInOldList);
    const message = generateMessage(appointment, "removeAttendees");
    await saveNotifications(message, attendeeListID, "removeAttendees", `/php/appointment`);
  }

  if(attendeesOnlyInNewList.length > 0){
    const attendeeListID = await getListOfUserID(attendeesOnlyInNewList);
    const message = generateMessage(appointment, "newAppointment");
    await saveNotifications(message, attendeeListID, "newAppointment", `/php/appointment`);
  }
}


// Check the user is admin? return the response
const checkUserType = (req, res) => {
  const { type } = getUserInfo(res);    // Get the user type from cookies token

  if(type == 'admin')
    res.send(true);
  else  
    res.send(false);
}


// To send the appointments to the user
const getAppointments = async (req, res) => {

  try {

    const { name, type } = getUserInfo(res);  // Get the user's name and user type from cookies token
    let isAdmin, appointments;

    const allAppointments = await retrieveAllAppointments();    // Get all appointments from database

    if(type == 'admin'){                      // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments based on the username
    }
  
    return res.json({                   // Send the response with data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Erorr sending appointments to frontend:',
      message: error.message
    });
  }

}


// To return the other user's name list
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

}


// To create a new appointment and store in database, then return all related appointements
const createAppointment = async (req, res) => {

  try {

    const gotAppointment = req.body;          // Get the new appointment
    const { name, type } = getUserInfo(res);  // Get the user's name from cookies token
    let isAdmin, appointments;

    // Add the username into creator property
    gotAppointment.creator = name;
    const newAppointment = new Appointment(gotAppointment);
    
    // Use await to wait for the save operation to complete
    await newAppointment.save();

    // Get all appointments from database
    const allAppointments = await retrieveAllAppointments();
  
    if (type == 'admin') {               // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;    // Get all the appointments
    } else {
      isAdmin = false;                   // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }

    // To get the user id and send notification about new appointment invitation
    const attendeeList = getListOfAttendees(gotAppointment);
    const attendeeListID = await getListOfUserID(attendeeList);
    const message = generateMessage(gotAppointment, "newAppointment");
    await saveNotifications(message, attendeeListID, "newAppointment", `/php/appointment`);
  
    return res.json({                    // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Error saving or processing appointment:',
      message: error.message
    });
  }

}


// To return a specific appointment based on id
const getSpecificAppointment = async (req, res) => {

  try {
    // Get the appointment id
    const id = req.params.id;   

    // Get the appointment from database based on id
    const appointment = await retrieveAppointmentByID(id);

    // send the appointment to frontend
    return res.json(appointment);

  } catch (error) {
    return res.status(400).json({
      error: 'Error sending specific appointment to frontend:',
      message: error.message
    });
  }

}


// To update a particular appointment data in database
const updateAppointment = async (req, res) => {
  
  try {
    const id = req.params.id;                 // The appointment id
    const updatedAppointment = req.body;      // Get the updated appointment
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    let isAdmin, appointments;

    // To get the old appointment data
    const oldAppointment = await Appointment.findById(id);
  
    await updateAppointmentById(id, updatedAppointment);      // Update the appointment in database

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database 
    
  
    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }

    // To get the old attendee list and new attendee list
    const oldAttendeeList = getListOfAttendees(oldAppointment);
    const newAttendeeList = getListOfAttendees(updatedAppointment);

    // Array containing names present in both lists
    const commonAttendees = oldAttendeeList.filter(name => newAttendeeList.includes(name));

    // Array containing names present in the old list but not in the new list
    const attendeesOnlyInOldList = oldAttendeeList.filter(name => !newAttendeeList.includes(name));

    // Array containing names present in the new list but not in the old list
    const attendeesOnlyInNewList = newAttendeeList.filter(name => !oldAttendeeList.includes(name));

    // Send the notification for updated appointment
    await notificationForUpdateAppointment(updatedAppointment, commonAttendees, attendeesOnlyInOldList, attendeesOnlyInNewList);
  
    return res.json({                          // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })

  } catch (error) {
    return res.status(400).json({
      error: 'Error updating appointment:',
      message: error.message
    });
  }

}


// To cancel the appointment
const cancelAppointment = async (req, res) => {

  try {
    const id = req.params.id;                 // The appointment id
    const newStatus = 'cancelled';            // Replace with the new status
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    let isAdmin, appointments;

    // To get the cancelled appointment data
    const cancelAppointment = await Appointment.findById(id);
  
    await updateAppointmentStatusById(id, newStatus);   // Update appointment status

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database

    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }

    // To get the user id and send notification for cancelled appointment
    const attendeeList = getListOfAttendees(cancelAppointment);
    const attendeeListID = await getListOfUserID(attendeeList);
    const message = generateMessage(cancelAppointment, "cancelAppointment");
    await saveNotifications(message, attendeeListID, "cancelAppointment", `/php/appointment`);
  
    return res.json({                   // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
    
  } catch (error) {
    return res.status(400).json({
      error: 'Error updating appointment status:',
      message: error.message
    });
  }
  
}


// To update the user response
const updateUserResponse = async (req, res) => {

  try {
    const id = req.params.id;                 // The appointment id
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    const userResponse = req.body;            // Get the user response
    let isAdmin, appointments;

    // To get the responded appointment data
    const respondedAppointment = await Appointment.findById(id);
  
    await updateAttendeeResponse(id, name, userResponse.response);  // Update the attendee response

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database

    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments !!!
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments !!!
    }

    // To get the creator id and send notification for appointment response
    let creatorID = await getListOfUserID([respondedAppointment.creator]);
    let titleAndTime = titleTimeMessage(respondedAppointment);

    if(userResponse.response === "accepted"){
      const message = `${name} has accepted the appointment: ${titleAndTime}`;
      await saveNotifications(message, creatorID, "acceptAppointment", `/php/appointment`);
    }
    else{
      const message = `${name} has declined the appointment: ${titleAndTime}`;
      await saveNotifications(message, creatorID, "declineAppointment", `/php/appointment`);
    }
    
  
    res.json({                          // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
    
  } catch (error) {
    return res.status(400).json({
      error: 'Error updating attendee response:',
      message: error.message
    });
  }

    
  
}


module.exports = 
{ checkUserType,
  getAppointments,
  getUserList,
  createAppointment,
  getSpecificAppointment,
  updateAppointment,
  cancelAppointment,
  updateUserResponse
}
