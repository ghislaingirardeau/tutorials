<template>
    <div>
        <h1>Votre confirmation</h1>
        <p>{{messagePayment}}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            messagePayment: ''
        }
    },
    async mounted() {
        // PAGE DE CONFIRMATION DE PAIEMENT
        // A LA CONFIRMATION, ENREGISTER DANS LA BASE DE DONNEE
        // RENVOIE VERS LA PAGE CONFIRMATION DON

        // PROBLEME DE LA METHODE = NE PEUT PAS ENVOYER DES DONNEES AUTRES EN OBJET 
        // DE LA PAGE PAIEMENT A LA PAGE CONFIRMATION
        // Comme par exemple le détail de la commande ou post commande dans la DB une fois seulement le paiement confirmé
        // SAUF TEST A FAIRE AVEC LA REPONSE DU HOOK 

        /* PAYMENT FROM SERVER SIDE */
        /* const clientSecret = this.$route.params.client_secret */
        /* PAYMENT FROM CLIENT SIDE */
        const clientSecret = new URLSearchParams(window.location.search).get(
            'payment_intent_client_secret'
        );
        const stripeKey = await this.$axios.$get('http://localhost:8000/api/stripe/stripeKey')
        const stripe = Stripe(stripeKey.key)
        await stripe.retrievePaymentIntent(clientSecret)
        .then(async (result) => {
            console.log(result)
              switch (result.paymentIntent.status) {
                case 'succeeded':
                this.messagePayment = 'Success! Payment received.'
                // LE PAIEMENT EST VALIDE, JE RECUPERE LES DATAS DU DONS LIE AU PAIEMENT
                const paymentIntent = new URLSearchParams(window.location.search).get(
                    'payment_intent'
                );
                const getData = await this.$axios.$get(`http://localhost:8000/api/stripe/v1/payment_methods/${paymentIntent}`)
                console.log(getData)
                break;
                case 'processing':
                this.messagePayment = "Payment processing. We'll update you when payment is received.";
                break;
                case 'requires_payment_method':
                this.messagePayment = 'Payment failed. Please try another payment method.';
                // Redirect your user back to your payment page to attempt collecting
                // payment again
                break;
                default:
                this.messagePayment = 'Something went wrong.';
                break;
            }
        });
    }
}
</script>