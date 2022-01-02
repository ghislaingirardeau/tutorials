const express = require('express')
const stripe = require('../controllers/stripe')

const router = express.Router()

router.get('/stripeKey', stripe.keyPublic)

/* STRIPE API FRONT */

// BALANCE ON STRPIE
router.get('/v1/balance', stripe.mybalance)

// CREATE CUSTOMER
router.post('/v1/customers', stripe.newCustomer)

//PAYMENT
router.post('/v1/payment_methods', stripe.paymentAPI)

/* ------------- */

/* CHECKOUT PAYMENT */
router.post('/create-checkout-session', stripe.checkout)
/* ---------------- */


/* PAYMENT INTENT VALIDATION  */

router.post('/create-payment-intent', stripe.paymentIntent) 
router.post('/v1/payment_intents/:id/cancel', stripe.cancelIntent) 

// RETRIEVE PAYMENT AFTER VALIDATION
router.get('/v1/payment_methods/:id', stripe.retrievePayment)

/* ------------- */

module.exports = router