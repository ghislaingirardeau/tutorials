const stripe = require('stripe')(process.env.STRIPE_KEY)

// information sur le store (ex si site e-commerce), info qui peuvent venir de la base de donnée par exemple
// Important: le prix vient de la base de donnée ou coté serveur et non coté client
// pour eviter qu'un hacker achete le produit id 1 pour 0 euro

exports.keyPublic = async (req, res, next) => {
  res.status(200).json({key: process.env.STRIPE_PUBLICKEY})
}

/* POUR UN PAIEMENT COTE API */

exports.paymentAPI = async (req, res, next) => {
    try {
        const paymentMethod = await stripe.paymentMethods.create({
          type: 'card',
          card: req.body.payment,
          billing_details: {
            name: req.body.user.name,
          }
        })
        
        const paymentCreate = await stripe.paymentIntents.create({
          amount: req.body.user.amount * 100,
          currency: 'eur',
          payment_method: paymentMethod.id,
        })
        
        const paymentConfirm = await stripe.paymentIntents.confirm(
          paymentCreate.id,
          {payment_method: paymentMethod.id}
        )
        res.status(200).json(paymentConfirm)
    } catch(e) {
      console.log(e.raw.message)
        res.status(404).json({messageCode: e.raw.message})
    }
}

// POUR UN PAIEMENT COTE FRONT JS SDK

exports.retrievePayment = async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(
    req.params.id
  )
  res.status(200).json(paymentIntent)
}

exports.paymentIntent = async (req, res, next) => {
  const amount = req.body.amount * 100
    try {
      // paymentIntent = say to stripe you try to make a payment and start to record
      // don't charge the card until is done 
      // paymentIntent => client secret to front => checkout with client sercret (protect from cut connection)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            automatic_payment_methods: {
              enabled: true,
            },
            metadata: req.body,
          });
        res.status(200).json({clientSecret: paymentIntent.client_secret})
    } catch(e) {
        res.status(500).json(e)
        console.log(e)
    }
}