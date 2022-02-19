const stripe = require('stripe')(process.env.STRIPE_KEY)

exports.newAccount = async (req, res, next) => {
    try {
        const account = await stripe.accounts.create({
            type: req.body.type,
            country: 'FR',
            email: req.body.email,
            capabilities: {
              card_payments: {requested: true},
              transfers: {requested: true},
            },
            business_type: 'non_profit'
        })
        /* const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'http://localhost:3000/stripeJS',
            return_url: 'http://localhost:3000',
            type: 'account_onboarding',
          }); */
        res.status(200).json(account)
        }
    catch(e) {
        console.log(e)
    }
}

exports.checkoutPayment = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{
              price: req.body.amount,
              quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`,
                payment_intent_data: {
              application_fee_amount: 123, // specifies the amount your platform plans to take from the transaction.
              transfer_data: {
                destination: 'acct_1KDPfUQdni9yBbuu', //id of the account you want to send the money
              },
            },
          })
          res.status(200).json(session)
        } catch (e) {
            console.log(e)
        }
}

  