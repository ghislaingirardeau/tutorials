<template>
    <div>
        <h1>Payment stripe backend</h1>
        
        <onlinePayment />
        
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Show my balance account on stripe</h2>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="stripeBalance">Show Balance</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Create a new customer</h2>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="newCustomer">New customer</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Show payment element</h2>
            </v-col>
            <v-col cols='10'>
                <p>possibilité de personnaliser les boutons payer et annuler</p>
                <p>inconvenient = recup des données à enregistrer sur la page success ??</p>
            </v-col>

            <v-col cols='10'>
                <v-btn color='primary' @click="showPaymentElement">Afficher le paiement</v-btn>
            </v-col>
            <v-col cols='10' v-show="paymentIntentId">
                <v-col cols='10' id="payment-element">
                </v-col>
                <v-btn color='success' id="submit" @click="paymentConfirm">Payer</v-btn>
                <v-btn color='warning' id="submit" @click="cancelPayment">Annuler</v-btn>
            </v-col>
            <!-- Je rentre les données pour valider le paiement -->
        </v-row>
      
    </div>
</template>

<script>
import onlinePayment from '@/components/onlinePayment.vue';

export default {
    data() {
        return{
            paymentIntentId: undefined,
           donation: {
                amount: 211, 
                donator: 'ghislain',
                association: 'care',
                voucher: [{name: 'geres', id: '123', amount: '234'}, {name: 'fap', id: '12233', amount: '34'}],
                tax_gain: '23',
                qrcode: '01638183481794JEDU'
            },
        }
    },
    components: {
        onlinePayment,
    },
    methods: {
        async stripeBalance() {
            const balance = await this.$axios.$get('http://localhost:8000/api/stripe/v1/balance')
            console.log(balance)
        },
        async newCustomer() {
            let customerData = {
                name: 'jean',
                email: "jean@mail.com",
                description: 'my first desciption',
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/v1/customers', JSON.stringify(customerData), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                console.log(response)
            })
        },

        // PAYMENT WITHOUT STRIPE FORM = pas de controle, ni authentification carte
        // PAYMENT WITH STRIPE FORM AND CONTROL
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
                this.paymentIntentId = response.id
                const appearance = {
                    theme: 'night',
                    labels: 'floating'
                };
                this.elements = this.stripe.elements({clientSecret: response.clientSecret, appearance})
                const paymentElement = this.elements.create("payment")
                paymentElement.mount("#payment-element")
            })
        },
        async paymentConfirm() {
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

<style>
  .my-input {
    padding: 10px;
    border: 1px solid #ccc;
    
  }
</style>