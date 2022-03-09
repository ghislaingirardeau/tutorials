<template>
    <div>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Multipart payement</h2>
            </v-col>
            <v-col cols='10'>
                <p>Créer un nouveau compte qui va recevoir l'argent</p>
                <p>Par exemple l'association qui va recevoir l'argent. Une asso = un compte</p>
                <p>créer le compte associé puis renvoie un lien stripe pour configurer le compte</p>
                <p>une fois le compte configurer, je peux envoyer le paiement vers ce compte via account id</p>
                <v-btn color="primary" @click="newAccount">New account and link</v-btn>
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
