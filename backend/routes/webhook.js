const express = require('express')
const webhook = require('../controllers/webhook')

const router = express.Router()

router.post('/', express.raw({type: 'application/json'}), webhook.test)

module.exports = router