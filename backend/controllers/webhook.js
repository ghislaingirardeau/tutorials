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

  // using stripe CLI
  // cmd.exe, download, folder stripe, type 'stripe listen --forward-to localhost:8000/webhook'
  // get the secret key
exports.test = (request, response, next) => {
  const sig = request.headers["stripe-signature"]
  const endpointSecret = 'whsec_73a8c978eb678800b5069fcb4001aa07774f021df797f7126b5ed191d01ca87b'
  let event
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret)
    
  } catch (error) {
    console.log(`webhook error: ${error.message}`);
    return response.status(400).send(`webhook error: ${error.message}`)
  }
  console.log(event.type);
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
  return response.status(200).send({ message: `webhook success ${event.id}` })

}