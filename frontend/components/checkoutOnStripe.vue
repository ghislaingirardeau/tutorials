<template>
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Payment sur la page produit Stripe</h2>
            </v-col>
            <v-col cols='10'>
                <v-btn @click="redirect" color="primary">Checkout</v-btn>
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
        async redirect() {
            let post = {
                amount: 'price_1JzHPNHasS9LTq87EHGSvl3k',
                don: 'toto',
                name: 'gege',
                voucher: [
                    {
                    entre: 'gtesgdy',
                    asso: 'sadfsdf'
                    },
                    {
                    entre: 'fgbfgb',
                    asso: 'fgtbhfrtbg'
                    }
                ]
            }
            await this.$axios.$post('http://localhost:8000/api/stripe/create-checkout-session', JSON.stringify(post), {
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
