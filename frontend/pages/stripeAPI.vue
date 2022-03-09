<template>
    <div>
        <h1>Payment stripe backend</h1>
        
        <cardOnlinePayment />

        <allOnlinePayment />

        <multipartPayment />

              
    </div>
</template>

<script>
import cardOnlinePayment from '@/components/cardOnlinePayment.vue';
import allOnlinePayment from '@/components/allOnlinePayment.vue';
import multipartPayment from '@/components/multipartPayment'

export default {
    data() {
        return{
            
        }
    },
    components: {
        cardOnlinePayment,
        allOnlinePayment,
        multipartPayment
    },
    methods: {

    }
}
</script>

<style>
  .my-input {
    padding: 10px;
    border: 1px solid #ccc;
    
  }
</style>