<template>
    <div>
        <v-row class="my-5">
            <v-col cols='10'>
                <p>Show my balance account on stripe</p>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="stripeBalance">Show Balance</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5">
            <v-col cols='10'>
                <p>Create a new customer</p>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="newCustomer">New customer</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5"> 
            <v-col cols='10'>
                <p>Paiement en envoyant les données de la carte bancaire,  FORM CONSTRUIRE</p>
            </v-col>
            <!-- PAIEMENT COTE SERVER DEPUIS API, RECUP DATA FRONT 
            ENVOIE TOUTES LES DONNEES PAIEMENT ET USER COTE SERVEUR
            UNE FOIS LE PAIEMENT REALISE, ENREGISTRE USER ET DATA DANS BASE DE DONNÉE
            PUSH ROUTER SUR CONFIRMATION AVEC ID DU DON ET LE RECU DE PAIEMENT
            INCONVENIENT = CARTE AVEC AUTHENTIFICATION -- A VALIDER COTÉ FRONT, donnee carte envoye directement au serveur
            https://stripe.com/docs/payments/accept-a-payment-synchronously
            -->
            <v-col cols='10'>
                <v-btn @click="submitAPI" color="primary">Paiement API</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5">
            <p>Affiche le paiement sous le format stripe</p>
            <v-col cols='10'>
                <v-btn color='accent' @click="showPaymentElement">Afficher le paiement</v-btn>
            </v-col>
            <v-col cols='10' v-show="paymentIntentId">
                <v-col cols='10' id="payment-element">
                </v-col>
                <v-btn color='accent' id="submit" @click="payment">Payer</v-btn>
                <v-btn color='accent' id="submit" @click="cancelPayment">Annuler</v-btn>
            </v-col>
            <!-- Je rentre les données pour valider le paiement -->
        </v-row>
      
    </div>
</template>

<script>
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
        async submitAPI() {
            let data = {
                user: {
                    amount: 89, 
                    name: '32567',
                },
                payment: {
                    number: '4111 1111 1111 1111',
                    exp_month: 12,
                    exp_year: 2022,
                    cvc: '314',
                },
            }
            
            await this.$axios.$post('http://localhost:8000/api/stripe/v1/payment_methods', JSON.stringify(data), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                console.log(response)
                /* if(response.status === 'succeeded') {
                    this.$router.push({ name: 'confirmation-id', params: {id: data.user.id, client_secret: response.client_secret}})
                } else {
                    alert("Le paiement n'a pas fonctionné")
                } */
            })
            .catch(error => {
                alert(error.response.data.messageCode)
            })
        },

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
            console.log(response)
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