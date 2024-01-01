const Case = require('../models/case');
const Message = require('../models/message');
const mongoose = require('mongoose');
const getUserInfo = require('../helpers/getUserInfo');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError } = require('../helpers/exceptions');

const checkCaseAccess = async (userId, type, caseId) => {
    // let cases;
    if (type === "admin" || type === 'partner')
        // cases = await Case.findById(new mongoose.Types.ObjectId(caseId))
        return true;
    // else
    //     cases = await Case.find(
    //         {
    //             "case_member_list.case_member_id": userId,
    //             "case_member_list.case_member_type": type,
    //             "_id": new mongoose.Types.ObjectId(caseId)
    //         }
    //     )

    // if (!cases || cases.length === 0)
    //     throw new DataNotExistError("Case not exist")
    // For associates, check if the case is assigned to them
    const cases = await Case.find({
        "case_member_list.case_member_id": userId,
        "case_member_list.case_member_type": "associates",
        "_id": new mongoose.Types.ObjectId(caseId)
    });

    return cases && cases.length > 0;
}

const createCase = async (req, res) => {
    const { type }  = getUserInfo(res);
    const userInfo = getUserInfo(res);

    const {
        case_title,
        case_description,
        case_type,
        case_status,
        case_priority,
        case_total_billed_hour,
        case_member_list
    } = req.body

    // check user is member of a cases or not
    // const current_cases = await Case.find({ cases_member_list: /john/i }, 'name friends').exec();

    // if no, return error

    // else continue

    // TODO: upload doc to cloudinary

    console.log(type);

    try {
        // Check if the user is an admin
        if (type === "admin" || type === "partner") {
            const new_cases = new Case({
                case_title, case_created_by: userInfo.userId, case_description, case_type, case_status, case_priority, case_total_billed_hour, case_member_list
            });
    
            const cases = await new_cases.save();
            if (!cases) {
                return res.json({
                    error: 'No cases uploaded'
                })
            }
    
            return res.status(200).send(new_cases)
        }
        else {
            return res.status(403).json({
                error: 'Permission denied. Only admin can create case.'
            });
        }
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors) {
                if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value"))
                    validationErrors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        }
    }

}

// const editCase = (req, res) => {
//     returnRes(res, 200, "editCase")
// }

// const editCase = async (req, res) => {
//     const { userId, type } = getUserInfo(res);
//     const caseId = req.params.id; // Extracting the case ID from the request parameters

//     try {
//         // await checkCaseAccess(userId, type, caseId); // Check if the user has access to the case

//         if (type !== "admin") {
//             return res.status(403).json({
//                 error: 'Permission denied. Only admin can edit a case.'
//             });
//         }

//         // Assuming req.body contains updated information for the case
//         const updatedData = req.body;

//         // Find the existing case by ID and update its information
//         const updatedCase = await Case.findByIdAndUpdate(
//             caseId,
//             { $set: updatedData },
//             { new: true } // Return the updated document
//         );

//         if (!updatedCase) {
//             return res.status(404).json({ error: 'Case not found' });
//         }

//         return res.status(200).json(updatedCase); // Return the updated case
//     } catch (error) {
//         // Handle potential errors
//         if (error instanceof mongoose.Error.ValidationError) {
//             // Mongoose validation error
//             const validationErrors = {};
//             for (const field in error.errors) {
//                 validationErrors[field] = error.errors[field].message;
//             }
//             return res.status(400).json({
//                 error: 'Validation failed',
//                 validationErrors,
//             });
//         } else {
//             res.status(400).json({
//                 error: error.name,
//                 message: error.message,
//             });
//         }
//     }
// };

const editCase = async (req, res) => {
    const { userId, type } = getUserInfo(res);
    const caseId = req.params.id; // Extracting the case ID from the request parameters

    console.log(type);

    try {
        const caseAccess = await checkCaseAccess(userId, type, caseId);

        console.log(caseAccess);

        //Check if the case exist and is accessible by the user
        if(caseAccess){
            // Check if the user has access to edit the case
            if (type === 'admin' || type === 'partner' || (type === 'associates' && caseAccess)) {
                // Assuming req.body contains updated information for the case
                const updatedData = req.body;
    
                // Find the existing case by ID and update its information
                const updatedCase = await Case.findByIdAndUpdate(
                    caseId,
                    { $set: updatedData },
                    { new: true } // Return the updated document
                );
    
                if (!updatedCase) {
                    return res.status(404).json({ error: 'Case not found' });
                }
    
                return res.status(200).json(updatedCase); // Return the updated case
            } else {
                // User does not have the required access
                return res.status(403).json({ error: 'Permission denied. Only admin or partners or associates can edit case.' });
            }
        } else {
            return res.status(404).json({ error: 'Case not found' });
        }

    } catch (error) {
        // Handle potential errors
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};
            for (const field in error.errors) {
                validationErrors[field] = error.errors[field].message;
            }
            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message,
            });
        }
    }
};


const readCase = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const caseId = req.params.id

    try {
        let cases;
        if (type === "admin" || type === "partner")
            cases = await Case.findById(new mongoose.Types.ObjectId(caseId))
        else
            cases = await Case.findOne(
                {
                    "case_member_list.case_member_id": userId,
                    "case_member_list.case_member_type": type,
                    "_id": new mongoose.Types.ObjectId(caseId)
                }
            )

        if (!cases || cases.length === 0)
            throw new DataNotExistError("Case not exist")
        return res.status(200).send(cases)

    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }

}

const readCaseMessage = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const caseId = req.params.id

    try {
        await checkCaseAccess(userId, type, caseId)
        const caseMessages = await Message.findOne({"message_case_id": caseId})
        if (!caseMessages)
            throw new DataNotExistError("Case not exist")

        return res.status(200).send(caseMessages)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const listCase = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    try {
        let cases;
        if (type === "admin")
            cases = await Case.find({})
        else
            cases = await Case.find(
                {
                    "case_member_list.case_member_id": userId,
                    "case_member_list.case_member_type": type
                }
            )

        if (!cases || cases.length === 0)
            throw new DataNotExistError("Case not exist")
        return res.status(200).send(cases)
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors) {
                if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value"))
                    validationErrors[field] = error.errors[field].message;
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        }
    }
}


// const deleteCase = (req, res) => {
//     res.status(200).send({
//         message: "deleteCase"
//     })
// }

// const deleteCase = async (req, res) => {
//     const { userId, type } = getUserInfo(res);
//     const caseId = req.params.id;

//     try {
//         let deletedCase;

//         if (type === "admin") {
//             // For admin, directly delete by caseId
//             deletedCase = await Case.findByIdAndDelete(caseId);
//         } else {
//             // For non-admin users, validate the user's access before deletion
//             await checkCaseAccess(userId, type, caseId);
//             deletedCase = await Case.findOneAndDelete({
//                 _id: caseId,
//                 "case_member_list.case_member_id": userId,
//                 "case_member_list.case_member_type": type
//             });
//         }

//         if (!deletedCase) {
//             return res.status(404).json({
//                 error: 'Case not found'
//             });
//         }

//         return res.status(200).json({
//             message: 'Case deleted successfully',
//             deletedCase
//         });
//     } catch (error) {
//         if (error instanceof mongoose.Error.ValidationError) {
//             // Mongoose validation error
//             const validationErrors = {};

//             for (const field in error.errors) {
//                 if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value")) {
//                     validationErrors[field] = error.errors[field].message;
//                 }
//             }

//             return res.status(400).json({
//                 error: 'Validation failed',
//                 validationErrors,
//             });
//         } else {
//             return res.status(400).json({
//                 error: error.name,
//                 message: error.message
//             });
//         }
//     }
// }

const deleteCase = async (req, res) => {
    const { type } = getUserInfo(res);
    const caseId = req.params.id;

    console.log(type);

    try {
        // Check if the user is an admin
        if (type !== "admin" && type !== "partner") {
            return res.status(403).json({
                error: 'Permission denied. Only admin can delete a case.'
            });
        }

        // For admin, directly delete by caseId
        const deletedCase = await Case.findByIdAndDelete(caseId);

        if (!deletedCase) {
            return res.status(404).json({
                error: 'Case not found'
            });
        }

        return res.status(200).json({
            message: 'Case deleted successfully',
            deletedCase
        });
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors) {
                if (!error.errors[field].message.includes("Cast to [ObjectId] failed for value")) {
                    validationErrors[field] = error.errors[field].message;
                }
            }

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            return res.status(400).json({
                error: error.name,
                message: error.message
            });
        }
    }
}


module.exports = {
    createCase, readCase, listCase, editCase, deleteCase, readCaseMessage
};
