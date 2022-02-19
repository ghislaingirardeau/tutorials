<template>
    <div>
        <!-- EXEMPLE POUR UN SITE E-COMMERCE AVE BOUTON DE REDIRECTION -->
        <v-btn @click="redirect" color="primary">Paiement sur la page stripe</v-btn>

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
