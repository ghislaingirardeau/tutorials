<template>
    <div>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Multipart payement</h2>
            </v-col>
            <v-col cols='10'>
                <h3>Créer un nouveau compte qui va recevoir l'argent</h3>
                <p>Par exemple l'association qui va recevoir l'argent. Une asso = un compte</p>
                <v-btn color="primary" @click="newAccount">New account</v-btn>
            </v-col>

            <v-col cols='10'>
                <v-btn type="submit" @click="checkoutPayment">Checkout</v-btn>
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
                type: 'express',
                email: "care@mail.com",
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/multipart/newAccount', JSON.stringify(accountData), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                console.log(response)
            })
        },
        async checkoutPayment() {
            let post = {
                amount: 'price_1JzHPNHasS9LTq87EHGSvl3k',
                don: 'toto',
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/multipart/create-checkout-session', JSON.stringify(post), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                console.log(response)
                /* window.location = response.url */
            })
        }
    }
}
</script>
