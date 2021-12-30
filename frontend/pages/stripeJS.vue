<template>
    <div>
        <!-- EXEMPLE POUR UN SITE E-COMMERCE AVE BOUTON DE REDIRECTION -->
        <v-btn @click="redirect" color="primary">tuto stripe</v-btn>

        <!-- GENERER JUSTE LE PAIEMENT PAR CARTE -->
        <label>Card
            <div class="my-input" id="card-element"></div>
        </label>

        <v-btn color="primary" outlined @click="submitCardOnly">submit</v-btn>

        <!-- PAIEMENT COTE CLIENT 
        INCONVENIENT = ENREGISTREMENT SUR BASE DE DONNÉE LORS DU SUCCESS 
        AVANTAGE = FENETRE AUTHENTIFICATION GENERER AUTO 
        -->
        <v-row class="my-5">
            <v-col cols='10'>
                <v-btn color='accent' @click="showPaymentElement">Afficher le paiement</v-btn>
            </v-col>
            <v-col cols='10' id="payment-element">

            </v-col>
            <v-col cols='10'>
                <v-btn color='accent' id="submit" @click="payment">Payer</v-btn>
            </v-col>
            <!-- Je rentre les données pour valider le paiement -->
        </v-row>

    </div>
</template>

<script>
export default {
    data() {
        return{
           elements: Object,
           stripe: undefined,
           cardElement: undefined,
           clientSecret: undefined,
           donation: {
                amount: 211, 
                donator: 'ghislain',
                association: 'care',
                /* voucher: [{name: 'geres', id: '123', amount: '234'}, {name: 'fap', id: '12233', amount: '34'}], */
                tax_gain: '23',
                qrcode: '01638183481794JEDU'
            }
        }
    },
    methods: {
        // au click du paiement :
        // charge page stripe, si validation
        // renvoie a une page qui doit envoyer les données a API pour enregistrement
        // comment faire le transfert de l'objet donation ??
        async showPaymentElement() {
            const stripeKey = await this.$axios.$get('http://localhost:8000/api/stripe/stripeKey')
            this.stripe = Stripe(stripeKey.key)

            // dire a stripe que je souhaite faire un payment (envoie le montant notamment) et de commencer à enregistrer = enregistre ainsi les echec ou les annulation
            await this.$axios.$post('http://localhost:8000/api/stripe/create-payment-intent', JSON.stringify(this.donation), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
            // recupere une clé secrete propre a la transaction !! le paiement n'est pas validé ici
                this.clientSecret = response.clientSecret
                const appearance = {
                    theme: 'night',
                    labels: 'floating'
                };
                this.elements = this.stripe.elements({clientSecret: response.clientSecret, appearance})
                const paymentElement = this.elements.create("payment")
                paymentElement.mount("#payment-element")
            })
        },
        async payment() {
            const billingDetails = {
                name: 'joe',
                email: 'joe2@mail.com',
                address: {
                    city: 'nantes',
                    postal_code: '44000'
                }
            }
            const {error} = await this.stripe.confirmPayment({
                elements: this.elements,
                confirmParams: {
                    return_url: `http://localhost:3000/success`,
                },
                billing_details: billingDetails,
            })
                
            if (error.type === "card_error" || error.type === "validation_error") {
                alert(error.message);
            } else {
                alert("An unexpected error occured.");
            }     
        },
        async submitCardOnly() {
            // recupere les données de l'elements carte de crédit
            this.cardElement = this.elements.getElement('card')
            // passe les données de facture envoyé a stripe (meme donnée que celle du donateur)
            const billingDetails = {
                name: 'joe',
                email: 'joe2@mail.com',
                address: {
                    city: 'nantes',
                    postal_code: '44000'
                }
            }
            // les données propres au site et a la base de donnée
            // !!!!!! la question du amount coté front ou back ????????/
            // dire a stripe que je souhaite faire un payment (envoie le montant notamment) et de commencer à enregistrer = enregistre ainsi les echec ou les annulation
            await this.$axios.$post('http://localhost:8000/api/stripe/create-payment-intent', JSON.stringify(this.donation), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
            // recupere une clé secrete propre a la transaction !! le paiement n'est pas validé ici
                this.clientSecret = response.clientSecret
            })
            // envoie les données liés au payment, facture, element de la carte
            const paymentMethodReq = await this.stripe.createPaymentMethod({
                type: 'card',
                card: this.cardElement,
                billing_details: billingDetails
            })
            console.log(paymentMethodReq.paymentMethod)
            // recupere la reponse pour la confirmation de paiement, relatif a ce paiement (grace a la cle secret)
            const confirmResponse = await this.stripe.confirmCardPayment(this.clientSecret, {
                payment_method: paymentMethodReq.paymentMethod.id
            })
            if(confirmResponse.paymentIntent.status === 'succeeded') {
                // si le paiement est confirmé, je redirige vers la page de confirmation
                // TEST ENVOIE EN PARAMS LES DONNÉES POUR ENREGISTREMENT DANS LA BASE DE DONNÉE
                // COUPLER STRIPE ET ENREGISTREMENT DU DON
                this.$router.push('success')
            }
        },
        // UTILE PAR EXEMPLE POUR UN SITE E-COMMERCE
        redirect() {
            this.stripe.redirectToCheckout({
                successUrl:'http://localhost:3000/success',
                cancelUrl: 'http://localhost:3000/error',
                lineItems: [
                    {
                        price: 'price_1JzHRxHasS9LTq87laDajcNV',
                        quantity: 2
                    }
                ],
                mode: 'payment'
            })
        },
    }
}
</script>

<style>
  .my-input {
    padding: 10px;
    border: 1px solid #ccc;
    
  }
</style>