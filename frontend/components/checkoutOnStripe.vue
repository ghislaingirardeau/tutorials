<template>
    <div>
        <!-- EXEMPLE POUR UN SITE E-COMMERCE AVE BOUTON DE REDIRECTION -->
        <v-btn @click="redirect" color="primary">Checkout</v-btn>

    </div>
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
