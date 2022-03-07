const stripe = require('stripe')(process.env.STRIPE_KEY, {maxNetworkRetries: 2})
const uuid = require('uuid') // generate a random key

// information sur le store (ex si site e-commerce), info qui peuvent venir de la base de donnée par exemple
// Important: le prix vient de la base de donnée ou coté serveur et non coté client
// pour eviter qu'un hacker achete le produit id 1 pour 0 euro

exports.keyPublic = async (req, res, next) => {
  res.status(200).json({key: process.env.STRIPE_PUBLICKEY})
}

exports.onlinePayment = async (req, res, next) => {
  const generateResponse = (intent) => {
    // Note that if your API version is before 2019-02-11, 'requires_action'
    // appears as 'requires_source_action'.
    if (
      intent.status === 'requires_action' &&
      intent.next_action.type === 'use_stripe_sdk'
    ) {
      // Tell the client to handle the action
      return {
        requires_action: true,
        payment_intent_client_secret: intent.client_secret
      };
    } else if (intent.status === 'succeeded') {
      // The payment didn’t need any additional actions and completed!
      // Handle post-payment fulfillment
      return {
        success: true,
        payment_intent_client_secret: intent.client_secret
      };
    } else {
      // Invalid status
      return {
        error: 'Invalid PaymentIntent status'
      }
    }
  };
  try {
    let intent;
    if (req.body.payment_method_id) {
      // Create the PaymentIntent
      intent = await stripe.paymentIntents.create({
        payment_method: req.body.payment_method_id,
        amount: 1099,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      }, { idempotencyKey: uuid.v4() });
    } else if (req.body.payment_intent_id) {
      intent = await stripe.paymentIntents.confirm(
        req.body.payment_intent_id, { idempotencyKey: uuid.v4() }
      );
    }
    // Send the response to the client
    res.send(generateResponse(intent));
  } catch (e) {
    // Display error on client
    return res.send({ error: e.message });
  }
}

// Pour voir le solde de mon compte stripe
exports.mybalance = async (req, res, next) => {
  stripe.balance.retrieve(function(err, balance) {
    console.log(balance)
    res.status(200).json(balance)
  });
}

exports.newCustomer = async (req, res, next) => {
  const customer = await stripe.customers.create({
    name: req.body.name,
    email: req.body.email,
    description: req.body.description,
  }, { idempotencyKey: uuid.v4() })
  res.status(200).json(customer)
}

/* POUR UN PAIEMENT COTE API */


exports.retrievePayment = async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    req.params.id
  )
  res.status(200).json(paymentIntent)
}

exports.paymentIntent = async (req, res, next) => {
  const {amount, currency, methods} = req.body
  
    try {
      // paymentIntent = say to stripe you try to make a payment and start to record
      // don't charge the card until is done 
      // paymentIntent => client secret to front => checkout with client sercret (protect from cut connection)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
          currency: currency,
          automatic_payment_methods: [methods],
          });
      res.status(200).json({ clientSecret: paymentIntent.client_secret, id: paymentIntent.id})
    } catch(e) {
      res.status(400).json({error: {
          message: e.message
        }})
      console.log(e.message)
    }
}

exports.cancelIntent = async (req, res, next) => {
  console.log(req.params.id)
  console.log(req.body)
    try {
      if(req.body.id === req.params.id) {
        const paymentIntent = await stripe.paymentIntents.cancel(
          req.params.id
        )
        res.status(200).json(paymentIntent.status)
      }
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}

exports.checkout = async (req, res, next) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1JzHPNHasS9LTq87EHGSvl3k',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/success`,
    cancel_url: `http://localhost:3000/cancel`,
    metadata: {
      'voucher' : req.body.don
    }
  });
  res.status(200).json({"url":session.url})
}