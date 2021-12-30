<template>
    <div>
        <h1>Test api stripe</h1>

        <!-- PAIEMENT COTE SERVER DEPUIS API, RECUP DATA FRONT 
        ENVOIE TOUTES LES DONNEES PAIEMENT ET USER COTE SERVEUR
        UNE FOIS LE PAIEMENT REALISE, ENREGISTRE USER ET DATA DANS BASE DE DONNÉE
        PUSH ROUTER SUR CONFIRMATION AVEC ID DU DON ET LE RECU DE PAIEMENT
        INCONVENIENT = CARTE AVEC AUTHENTIFICATION -- A VALIDER COTÉ FRONT, donnee carte envoye directement au serveur
        https://stripe.com/docs/payments/accept-a-payment-synchronously
        -->
        <v-btn @click="submitAPI" color="primary">Paiement API</v-btn>

    </div>
</template>

<script>
export default {
    data() {
        return{
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
        // PAYMENT COTE SERVER, INCONVENIENT = AUTHENTIFICATION A PARAMETRER
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