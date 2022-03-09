<template>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Payment sur la page produit Stripe</h2>
            </v-col>
            <v-col cols='10'>
                <p>user est lié à un numéro de customer stripe</p>
                <p>a la connection du client sur le site (avec une db), je récupere son id stripe pour faire le paiement</p>
                <p>si pas connecté, enregistre le nouveau client dans la db et dans stripe</p>
                <p>chaque produit in DB doit etre associé a un produit stripe, avec id product stripe</p>
                <v-btn @click="payStripeCheckout" color="primary">Checkout</v-btn>
            </v-col>
        </v-row>

</template>

<script>

export default {
    data() {
        return{
            stripe: undefined,
        }
    },
    methods: {
        // UTILE PAR EXEMPLE POUR UN SITE E-COMMERCE
        async payStripeCheckout() {
            // envoie les articles du caddie
            // si nouveau customer = créer un nouveau customer stripe coté backend
            // envoie un numero de transaction
            // webhook renvoie une notification du nouvel achat
            let cart = [
                {
                    price: 'price_1JzHPNHasS9LTq87EHGSvl3k',
                    quantity: 3
                },
                {
                    price: 'price_1JzHRxHasS9LTq87laDajcNV',
                    quantity: 2
                },
            ]
            let customer = 'cus_KduLnhgrRuvimV'
            let transaction = '123456'
            const data = {cart, customer, transaction}
            await this.$axios.$post('http://localhost:8000/api/stripe/create-checkout-session', JSON.stringify(data), {
                headers: {
                "content-type": "application/json",
                },
            })
            .then(response => {
                window.location = response.url 
                
            })
        }
    }
}
</script>
