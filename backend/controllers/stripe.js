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

exports.tokenElement = async (req, res, next) => {
  const token = await stripe.tokens.retrieve(
    req.body.token.id
  );
  res.status(200).json(token)
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
  try {
    const session = await stripe.checkout.sessions.create({
      customer: req.body.customer,
      client_reference_id: req.body.transaction,
      line_items: req.body.cart,
      /* shipping_address_collection: {
        allowed_countries: ['FR', 'GB'],
      }, */
      mode: 'payment',
      shipping_options: [{
        shipping_rate: 'shr_1KLkrVHasS9LTq87pupkFYA4'
      }],
      success_url: `http://localhost:3000/confirm/${req.body.transaction}`,
      cancel_url: `http://localhost:3000/cancel`,
    });
    //facultatif à supprimer
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent
    );
    console.log(paymentIntent.client_secret);
    /* --------------------- */

    res.status(200).json({ "url": session.url })
  } catch (error) {
    res.status(400).json({
      error: {
        message: error.raw.message
      }
    })
    console.log(error.raw.message);
  }
}