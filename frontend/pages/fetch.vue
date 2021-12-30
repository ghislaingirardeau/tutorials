<template>
    <div>
        <h3>{{data.data}}</h3>

        <!-- PAIEMENT COTE SERVER DEPUIS API, RECUP DATA FRONT 
        ENVOIE TOUTES LES DONNEES PAIEMENT ET USER COTE SERVEUR
        UNE FOIS LE PAIEMENT REALISE, ENREGISTRE USER ET DATA DANS BASE DE DONNÉE
        PUSH ROUTER SUR CONFIRMATION AVEC ID DU DON ET LE RECU DE PAIEMENT
        INCONVENIENT = CARTE AVEC AUTHENTIFICATION -- A VALIDER COTÉ FRONT, donnee carte envoye directement au serveur
        https://stripe.com/docs/payments/accept-a-payment-synchronously
        -->

    </div>
</template>

<script>
export default {
    data() {
        return{
            data: '',
        }
    },
    async fetch() {
        this.data = await this.$axios.$get('https://reqres.in/api/products')
    },
    methods: {
    }
}
</script>