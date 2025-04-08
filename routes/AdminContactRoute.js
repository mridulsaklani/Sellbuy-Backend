const express = require('express')
const router = express.Router()

const {getContactData, PostContactData, DeleteContactData, getActiveContactData, setActive} = require('../controllers/AdminContactController');


router.get("/", getContactData);
router.get("/active", getActiveContactData)
router.post('/', PostContactData);
router.patch('/:id', setActive)
router.delete('/:id', DeleteContactData)


module.exports = router