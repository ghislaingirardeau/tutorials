const stripe = require('stripe')(process.env.STRIPE_KEY)

exports.newAccount = async (req, res, next) => {
    try {
        const account = await stripe.accounts.create({
          type: req.body.type,
        })
        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: 'http://localhost:3000/reauth',
            return_url: 'http://localhost:3000/stripeAPI',
            type: 'account_onboarding',
        });
        res.status(200).json({ "url": accountLink.url })
        }
    catch(e) {
      res.status(400).json(e)
    }
}

exports.checkoutPayment = async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{
              price: req.body.amount,
              quantity: 5,
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/success`,
            cancel_url: `http://localhost:3000/cancel`,
            payment_intent_data: {
              application_fee_amount: 200 * req.body.totalQuantity, // specifies the amount your platform plans to take from the transaction.
              transfer_data: {
                destination: 'acct_1KbLSDQigQ19mWP1', //id of the account you want to send the money
              },
            },
        })
        res.status(200).json(session)
        } catch (e) {
            console.log(e)
            res.status(400).json(e)
        }
}

  