const multer = require('multer')
const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController')
const { requireAuth, requireLawyerAndAdmin, requireAdmin } = require('../middlewares/authMiddleware')
const upload = multer({ dest: 'uploads/' })

router.get('/all', requireAuth, documentController.listDoc) // get list of documents
router.get('/all/:caseId', requireAuth, documentController.listDocByCase) // get list of documents of certain case
router.get('/:id/:caseId', requireAuth, documentController.readDoc) // get only selected document
router.post('/', requireAuth, upload.single('docUpload'), documentController.createDoc) // upload new document
router.put('/', requireAuth, documentController.updateDoc) // edit selected document
router.delete('/:id/:caseId', requireAuth, documentController.deleteDoc) // delete a document

module.exports = router;