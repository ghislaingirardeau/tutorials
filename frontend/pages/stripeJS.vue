<template>
    <div>

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