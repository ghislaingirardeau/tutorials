const stripe = require('stripe')(process.env.STRIPE_KEY)

/* FUNCTION save information in the database here */
const saveInDatabase = (dataToSave) => {
  console.log("dataToSave", dataToSave);
}

// WEBHOOK
exports.listen = (request, response, next) => {
    let event = request.body
    // securiser le webhook ici
    const endpointSecret = process.env.STRIPE_WEBHOOK
    if (endpointSecret) {
      const signature = request.headers['stripe-signature'];
      try {
        event = stripe.webhooks.constructEvent(
          request.body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
    }
   
    // SUIVANT LE TYPE D'EVENEMENT
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for was successful!`)
        saveInDatabase(event.data.object)
        break;

      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(`PaymentIntent is attached!`);
        break;

      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }