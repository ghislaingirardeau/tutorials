const express = require('express')
const i18n = require('../controllers/i18n')
const language = require('../middleware/language')

const router = express.Router()

router.get('/', language, i18n.getDatas)

module.exports = router