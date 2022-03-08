<template>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Checkout payment with custom payment flow</h2>
            </v-col>
            <v-col cols='10'>
                <p>possibilité de personnaliser les boutons payer et annuler</p>
                <p>accepte tous les moyens de paiement</p>
                <p>inconvenient = recup des données à enregistrer sur la page success ??</p>
                <a href="https://stripe.com/docs/payments/quickstart">lien tuto</a>
            </v-col>

            <v-col cols='10'>
                <v-btn color='primary' @click="showPaymentElement">Afficher le paiement</v-btn>
            </v-col>
            <v-col cols='10' v-show="showCardElement">
                <v-col cols='10' id="payment-element">
                </v-col>
                <v-btn color='success' id="submit" @click="paymentConfirm">Payer</v-btn>
                <v-btn color='warning' id="submit" @click="cancelPayment">Annuler</v-btn>
            </v-col>
            <!-- Je rentre les données pour valider le paiement -->
        </v-row>
</template>

<script>
    export default {
        data() {
            return{
                paymentIntentId: undefined,
                amount: {
                    amount: 211, 
                    currency: 'eur',
                    paymentMethod: 'card'
                },
                showCardElement: false
            }
        },
        methods: {
            async showPaymentElement() {
                this.showCardElement = !this.showCardElement
                if (this.showCardElement) {
                    const stripeKey = await this.$axios.$get('http://localhost:8000/api/stripe/stripeKey')
                    this.stripe = Stripe(stripeKey.key)

                    // dire a stripe que je souhaite faire un payment (envoie le montant notamment) et de commencer à enregistrer = enregistre ainsi les echec ou les annulation
                    await this.$axios.$post('http://localhost:8000/api/stripe/create-payment-intent', JSON.stringify(this.amount), {
                        headers: {
                        "content-type": "application/json",
                        },
                    })
                    .then(response => {
                    // recupere une clé secrete propre a la transaction !! le paiement n'est pas validé ici
                        this.paymentIntentId = response.id
                        const appearance = {
                            theme: 'night',
                            labels: 'floating'
                        };
                        this.elements = this.stripe.elements({clientSecret: response.clientSecret, appearance})
                        const paymentElement = this.elements.create("payment")
                        paymentElement.mount("#payment-element")
                    })
                } else {
                    this.cancelPayment()
                }
            },
            async paymentConfirm() {
                const billingDetails = {
                    id: 1234456,
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
                        return_url: `http://localhost:3000/confirm/${billingDetails.id}`,
                    },
                    billing_details: billingDetails,
                })
                    
                if (error.type === "card_error" || error.type === "validation_error") {
                    alert(error.message);
                } else {
                    alert("An unexpected error occured.");
                }     
            },
            async cancelPayment() {
                let cancelId = {
                    id: this.paymentIntentId
                }

                await this.$axios.$post(`http://localhost:8000/api/stripe/v1/payment_intents/${this.paymentIntentId}/cancel`, JSON.stringify(cancelId), {
                    headers: {
                    "content-type": "application/json",
                    },
                })
                .then(response => {
                    console.log(response)
                    this.paymentIntentId = undefined
                })

            }
        }
    }
</script>

<style lang="scss" scoped>

</style>