const express = require('express')
const notification = require('../controllers/notification')

const router = express.Router()

router.post('/subscribe', notification.pushNotif)

module.exports = router