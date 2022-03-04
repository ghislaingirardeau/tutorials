<template>
    <div>
        <h1>Payment stripe coté frontend</h1>
        <checkoutOnStripe />

        <cardPayment />

        <multipartPayment />

    </div>
</template>

<script>
import checkoutOnStripe from '@/components/checkoutOnStripe'
import cardPayment from '@/components/cardPayment'
import multipartPayment from '@/components/multipartPayment'

export default {
    data() {
        return{
        }
    },
    methods: {
    }
}
</script>