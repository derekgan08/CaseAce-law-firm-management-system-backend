const fs = require('fs')
const getUserInfo = require('../helpers/getUserInfo');
const saveNotifications = require('../helpers/saveNotification');
const { DataNotExistError, UserNotSameError, DoNotHaveAccessError } = require('../helpers/exceptions');
const validator = require('validator');
const Document = require('../models/document');
const mongoose = require('mongoose');
const { promisify } = require('util')
const Case = require('../models/case');
const googleDrive = require('../utils/googleDrive'); // Import the new module
const unlinkAsync = promisify(fs.unlink)
const { cloudinary } = require('../config/cloudinary');
const Message = require('../models/message');
const User = require('../models/user');

const checkCaseAccess = async (userId, type, caseId) => {
    let cases;
    if (type === "admin")
        cases = await Case.findById(new mongoose.Types.ObjectId(caseId))
    else
        cases = await Case.find(
            {
                "case_member_list.case_member_id": userId,
                "case_member_list.case_member_type": type,
                "_id": new mongoose.Types.ObjectId(caseId)
            }
        )

    if (!cases || cases.length === 0)
        throw new DataNotExistError("Case not exist")
}

const updateDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)

    const {
        q: { q_id, q_caseId },
        doc_link,
        doc_type,
        filesize,
        uploaded_at,
        last_accessed_at,
        doc_title,
        uploaded_by,
        can_be_access_by,
        doc_case_related,
        doc_description
    } = req.body

    const filter = {
        "doc_case_related": q_caseId,
        "uploaded_by": userId,
        "_id": new mongoose.Types.ObjectId(q_id)
    }

    const update = {
        doc_type,
        doc_title,
        can_be_access_by,
        doc_description
    }

    try {
        await checkCaseAccess(userId, type, filter.doc_case_related)

        const selectedDocument = type !== "admin" ? await Document.findOneAndUpdate(
            filter, {
            ...update,
            "$push":
            {
                "last_accessed_at": {
                    "userId": userId,
                    "type": type,
                    "action": "edit",
                    "access_date_time": (Date.now())
                }
            }
        }, { new: true }
        ) : await Document.findByIdAndUpdate(filter._id,
            update
        )

        if (!selectedDocument) {
            throw new DataNotExistError("Document not exist")
        }
        let editedByUserName = await User.findById(new mongoose.Types.ObjectId(userId)).select(['username']);
        let editedCaseName = await Case.findById(new mongoose.Types.ObjectId(q_caseId)).select(['case_title']);
        
        await saveNotifications(`${editedByUserName.username} has edited document in this case: ${editedCaseName.case_title}`, can_be_access_by, "editDocument", `/php/document/view.php?id=${selectedDocument._id}&cid=${editedCaseName._id}`)

        return res.status(200).send(selectedDocument)
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

const readDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id, caseId } = req.params
    try {
        // check curent user is in case?
        await checkCaseAccess(userId, type, caseId)

        // findandupdate
        const requestedDocument = await Document.findByIdAndUpdate(new mongoose.Types.ObjectId(id),
            {
                "$push":
                {
                    "last_accessed_at": {
                        "userId": userId,
                        "type": type,
                        "action": "view",
                        "access_date_time": Date.now()
                    }
                }
            }, { new: true }
        )

        const uploadUserId = requestedDocument.uploaded_by
        let uploadedByUserName = await User.findById(new mongoose.Types.ObjectId(uploadUserId)).select(['username', 'avatar_url']);

        const lastAccessUserId = requestedDocument.last_accessed_at[requestedDocument.last_accessed_at.length - 1].userId
        let lastAccessedByUserName = await User.findById(new mongoose.Types.ObjectId(lastAccessUserId)).select(['username', 'avatar_url']);

        const relatedCaseId = requestedDocument.doc_case_related
        let relatedCaseName = await Case.findById(new mongoose.Types.ObjectId(relatedCaseId)).select('case_title');

        if (!requestedDocument)
            throw new DataNotExistError("Document not exist")

        return res.status(200).send({ ...requestedDocument._doc, canEdit: requestedDocument.uploaded_by === userId, uploadedByUserName, lastAccessedByUserName, relatedCaseName })
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

const listDoc = async (req, res) => {
    try {
        const allDocument = await Document.find({})
        let updatedCaseDocs = []
        for (const doc of allDocument) {
            const uploadUserId = doc.uploaded_by
            let uploadedByUserName = await User.findById(new mongoose.Types.ObjectId(uploadUserId)).select(['username', 'avatar_url']);

            const lastAccessUserId = doc.last_accessed_at[doc.last_accessed_at.length - 1].userId
            let lastAccessedByUserName = await User.findById(new mongoose.Types.ObjectId(lastAccessUserId)).select(['username', 'avatar_url']);

            const relatedCaseId = doc.doc_case_related
            let relatedCaseName = await Case.findById(new mongoose.Types.ObjectId(relatedCaseId)).select('case_title');

            updatedCaseDocs.push({ ...doc._doc, uploadedByUserName, lastAccessedByUserName, relatedCaseName })
        }

        if (!allDocument)
            throw new DataNotExistError("Document not exist")

        return res.status(200).send(updatedCaseDocs)
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

const listDocByCase = async (req, res) => {
    const { caseId } = req.params
    const { userId, type } = getUserInfo(res)
    try {
        const filter = type !== "admin" ? {
            "doc_case_related": caseId,
            "can_be_access_by": userId
        } : { "doc_case_related": caseId, }

        const caseDocuments = await Document.find(filter)
        let updatedCaseDocs = []
        for (const doc of caseDocuments) {
            const uploadUserId = doc.uploaded_by
            let uploadedByUserName = await User.findById(new mongoose.Types.ObjectId(uploadUserId)).select(['username', 'avatar_url']);

            const lastAccessUserId = doc.last_accessed_at[doc.last_accessed_at.length - 1].userId
            let lastAccessedByUserName = await User.findById(new mongoose.Types.ObjectId(lastAccessUserId)).select(['username', 'avatar_url']);
            const relatedCaseId = doc.doc_case_related
            let relatedCaseName = await Case.findById(new mongoose.Types.ObjectId(relatedCaseId)).select('case_title');
            updatedCaseDocs.push({ ...doc._doc, uploadedByUserName, lastAccessedByUserName, relatedCaseName })
        }

        if (!caseDocuments)
            throw new DataNotExistError("Document not exist")
        await checkCaseAccess(userId, type, caseId)

        return res.status(200).send(updatedCaseDocs)
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

const createDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const authClient = await googleDrive.authorize()
    const uploadedDoc = await googleDrive.uploadFile(authClient, req.file)
    const cloudinaryUploadedImage = await cloudinary.uploader.upload(req.file.path + ".png");

    await unlinkAsync(req.file.path)

    let {
        doc_type,
        filesize,
        uploaded_at,
        doc_title,
        uploaded_by,
        can_be_access_by,
        doc_case_related,
        req_msg_id,
        doc_description
    } = req.body



    const doc_link_file = "http://docs.google.com/uc?export=open&id=" + uploadedDoc.data.id
    const doc_link_fileId = uploadedDoc.data.id
    const doc_link_onlineDrive = "https://drive.google.com/file/d/" + uploadedDoc.data.id + "/view?usp=sharing"
    const doc_avatar = cloudinaryUploadedImage.url;

    if (!uploaded_by) {
        uploaded_by = userId
    }
    let uploadedByUserName = await User.findById(new mongoose.Types.ObjectId(uploaded_by)).select(['username']);
    let relatedCaseName = await Case.findById(new mongoose.Types.ObjectId(doc_case_related)).select('case_title');
    if (!can_be_access_by || can_be_access_by.length === 0) {
        let cases = await Case.findById(new mongoose.Types.ObjectId(doc_case_related)).select('case_member_list');
        can_be_access_by = []
        cases.case_member_list.forEach((member, i) => {
            can_be_access_by.push(member.case_member_id)
        })
    }

    const last_accessed = [{
        userId,
        type,
        action: "upload",
        access_date_time: (Date.now())
    }]

    try {
        await checkCaseAccess(userId, type, doc_case_related)

        const new_document = new Document({
            doc_link_file,
            doc_link_fileId,
            doc_link_onlineDrive,
            doc_type,
            filesize,
            uploaded_at: (Date.now()),
            doc_title,
            uploaded_by,
            can_be_access_by,
            doc_avatar,
            doc_case_related,
            doc_description,
            last_accessed_at: last_accessed
        });

        const document = await new_document.save();
        if (!document) {
            return res.json({
                error: 'No document uploaded'
            })
        }
        if (req_msg_id && req_msg_id !== "undefined") {
            console.log(req_msg_id);
            const new_updated_message = await Message.findOneAndUpdate({
                "message_case_id": doc_case_related,
                "message_list._id": req_msg_id
            }
                ,
                {
                    $set: {
                        "message_list.$.message_type": "requested_and_uploaded"
                    }
                })
        }

        await saveNotifications(`${uploadedByUserName.username} has uploaded new document in this case: ${relatedCaseName.case_title}`, can_be_access_by, "addDocument",  `/php/document/view.php?id=${document._id}&cid=${relatedCaseName._id}`)


        return res.status(200).send(new_document)
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

const deleteDoc = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const { id, caseId } = req.params

    const filter = type === "admin" ? {
        "_id": new mongoose.Types.ObjectId(id)
    } : {
        "doc_case_related": q_caseId,
        "uploaded_by": userId,
        "_id": new mongoose.Types.ObjectId(id)
    }

    try {
        await checkCaseAccess(userId, type, caseId)

        const deletedDocument = await Document.findOneAndDelete(filter)

        if (!deletedDocument)
            throw new DataNotExistError("Document not exist")

        // TODO: delete file from googledrive
        const authClient = await googleDrive.authorize()
        const deletedDoc = await googleDrive.deleteFile(authClient, deletedDocument.doc_link_fileId)
        console.log(deletedDocument);

        let deletedByUserName = await User.findById(new mongoose.Types.ObjectId(userId)).select(['username']);
        console.log(deletedByUserName);
        let deletedCaseName = await Case.findById(new mongoose.Types.ObjectId(caseId)).select(['case_title']);
        console.log(deletedCaseName);
        
        await saveNotifications(`${deletedByUserName.username} has deleted ${deletedDocument.doc_title} (document) in this case: ${deletedCaseName.case_title}`, deletedDocument.can_be_access_by, "deleteDocument", `/php/case/view.php?cid=${caseId}`)

        return res.status(200).send(deletedDocument)
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

module.exports = {
    createDoc, readDoc, listDoc, updateDoc, deleteDoc, listDocByCase
};
