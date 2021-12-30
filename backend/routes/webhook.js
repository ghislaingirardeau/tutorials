const express = require('express')
const webhook = require('../controllers/webhook')

const router = express.Router()

router.post('/webhook', express.raw({type: 'application/json'}), webhook.listen)

module.exports = router