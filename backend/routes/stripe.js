const express = require('express')
const stripe = require('../controllers/stripe')

const router = express.Router()

router.get('/stripeKey', stripe.keyPublic)

// FROM API PAYMENT

router.post('/v1/payment_methods', stripe.paymentAPI)

// FROM SDK PAYMENT

router.post('/create-payment-intent', stripe.paymentIntent) 

router.get('/v1/payment_methods/:id', stripe.retrievePayment)

module.exports = router