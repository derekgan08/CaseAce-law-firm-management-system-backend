const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController')
const {requireAuth} = require('../middlewares/authMiddleware')

router.get('/', requireAuth, caseController.listCase) // get list of cases
router.get('/:id', requireAuth, caseController.readCase) // get only selected case
router.get('/:id/message', requireAuth, caseController.readCaseMessage) // get only selected case
router.post('/', requireAuth, caseController.createCase) // upload new case
router.put('/:id', requireAuth, caseController.editCase) // edit selected case
router.delete('/:id', requireAuth, caseController.deleteCase) // delete a case

module.exports = router;