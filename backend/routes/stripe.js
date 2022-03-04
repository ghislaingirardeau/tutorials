const express = require('express')
const stripe = require('../controllers/stripe')
const stripeMulti = require('../controllers/stripeMulti')

const router = express.Router()

router.get('/stripeKey', stripe.keyPublic)

/* STRIPE API FRONT */

// ONLINEPAYMENT TUTO

router.post('/pay', stripe.onlinePayment)

// BALANCE ON STRPIE
router.get('/v1/balance', stripe.mybalance)

// CREATE CUSTOMER
router.post('/v1/customers', stripe.newCustomer)

/* ------------- */

/* CHECKOUT PAYMENT */
router.post('/create-checkout-session', stripe.checkout)
/* ---------------- */

/* PAYMENT INTENT VALIDATION  */

router.post('/create-payment-intent', stripe.paymentIntent) // CREATE THE PAYMENT ELEMENT FRONTEND WITH PAYMENT INTENT ID
router.post('/v1/payment_intents/:id/cancel', stripe.cancelIntent) // IF CANCEL PAYMENT FRONT = ANNULE PAYMENT INTENT STRIPE
router.get('/v1/payment_methods/:id', stripe.retrievePayment) // RETRIEVE PAYMENT AFTER VALIDATION ON MY SUCCESS PAGE

/* ------------- */

/* MULTIPART PAYMENT */

router.post('/multipart/newAccount', stripeMulti.newAccount)
router.post('/multipart/create-checkout-session', stripeMulti.checkoutPayment)


/* ------------------- */

module.exports = router