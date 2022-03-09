<template>
    <div>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Multipart payement</h2>
            </v-col>
            <v-col cols='10'>
                <p>Créer un nouveau compte qui va recevoir l'argent. fait par l'admin par exemple si peu de compte</p>
                <p>Par exemple l'association qui va recevoir l'argent. Une asso = un compte</p>
                <p>créer le compte associé puis renvoie un lien stripe pour configurer le compte</p>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="newAccount">New account and link</v-btn>
            </v-col>

            <v-col cols='10'>
                <p>une fois le compte configurer, je peux envoyer le paiement vers ce compte via account id</p>
                <p>sur n'importe quel type de paiment: checkout, card, paymentelement...</p>
                <strong>Add this line in stripe.paymentIntents.create to link the payment</strong>
                <code>
                    intent = await stripe.paymentIntents.create({
                        application_fee_amount: 123, // specifies the amount your platform plans to take from the transaction.
                        transfer_data: {
                            destination: '{ACCOUNT_ID}', //id of the account you want to send the money
                        },
                    });
                </code>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="checkoutPayment">Checkout</v-btn>
            </v-col>

        </v-row>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        async newAccount() {
            let accountData = {
                type: 'standard',
                email: "ghislain.girardeau@neuf.fr",
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/multipart/newAccount', JSON.stringify(accountData), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                window.location = response.url 
            })
        },
        async checkoutPayment() {
            let post = {
                amount: 'price_1KbK6THasS9LTq87yhlXhuZv',
                don: 'toto',
                totalQuantity: 5
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/multipart/create-checkout-session', JSON.stringify(post), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                console.log(response)
                window.location = response.url
            })
        }
    }
}
</script>
