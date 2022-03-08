<template>
    <div>
        <h1>Payment stripe backend</h1>
        
        <cardOnlinePayment />

        <allOnlinePayment />
        
        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Show my balance account on stripe</h2>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="stripeBalance">Show Balance</v-btn>
            </v-col>
        </v-row>

        <v-row class="my-5">
            <v-col cols='10'>
                <h2>Create a new customer</h2>
            </v-col>
            <v-col cols='10'>
                <v-btn color="primary" @click="newCustomer">New customer</v-btn>
            </v-col>
        </v-row>
      
    </div>
</template>

<script>
import cardOnlinePayment from '@/components/cardOnlinePayment.vue';
import allOnlinePayment from '@/components/allOnlinePayment.vue';
export default {
    data() {
        return{
            
        }
    },
    components: {
        cardOnlinePayment,
        allOnlinePayment
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

    }
}
</script>

<style>
  .my-input {
    padding: 10px;
    border: 1px solid #ccc;
    
  }
</style>