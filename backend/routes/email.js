const express = require('express')
const email = require('../controllers/email')

const router = express.Router()

router.get('/', email.send)

module.exports = router