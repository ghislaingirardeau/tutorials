<template>
    <v-row class="my-5">
        <v-col cols="10">
            <h2>Payment finalize server side / element build on frontend / save database on succeed</h2>
        </v-col>
        <v-col cols="10" >
            <form id='payment-form'> <!-- https://stripe.com/docs/payments/accept-a-payment-synchronously -->
                <label>
                    Card details
                    <div id="card-element-test" class="my-5"></div>
                </label>
                <v-btn color="primary" @click="onlinePayment">online payment</v-btn>
                <v-btn color="primary" @click="testToken">token</v-btn>
            </form>    
        </v-col>
    </v-row>
</template>

<script>
    export default {
        data() {
            return {
                stripe: undefined,
                cardElement: undefined
            }
        },
        methods: {
            onlinePayment() {
                const handleServerResponse = (response) => {
                    if (response.error) {
                        alert(response.error);
                    } else if (response.requires_action) {
                        // Use Stripe.js to handle required card action
                        this.stripe.handleCardAction(
                        response.payment_intent_client_secret
                        ).then(handleStripeJsResult);
                    } else {
                        // SUCCESS HERE
                        // SAVE DATA IN DB
                        // SEND DATA AS PARAMS URL TO SHOW CONFIRM PAGE WITH DATAS SUMMARIES
                        // QUERY PAYMENT INTENT TO CONFIRM PAYMENT
                        const datas = {
                            test: ['12', 'sdybvyudb'],
                            name: 'alan'
                        }
                        this.$router.push({ name: 'success', params: {data: datas}, query: { payment_intent_client_secret: response.payment_intent_client_secret } })
                    }
                }    
                const handleStripeJsResult = async (result) => {
                    if (result.error) {
                        // Show error in payment form
                        alert(response.error);
                    } else {
                        // The card action has been handled
                        // The PaymentIntent can be confirmed again on the server
                        await this.$axios.$post('http://localhost:8000/api/stripe/pay', JSON.stringify({ payment_intent_id: result.paymentIntent.id }), {
                            headers: {
                            "content-type": "application/json",
                            },
                        })
                        .then(function(confirmResult) {
                            return confirmResult
                        }).then(handleServerResponse);
                    }
                }     

                const stripePaymentMethodHandler = async (result) => {
                    
                    if (result.error) {
                        alert(response.error);
                    } else {
                        // Otherwise send paymentMethod.id to your server
                        const data = {
                            payment_method_id: result.paymentMethod.id,
                        }

                        await this.$axios.$post('http://localhost:8000/api/stripe/pay', JSON.stringify(data), {
                            headers: {
                            "content-type": "application/json",
                            },
                        })
                        .then(function(result) {
                            handleServerResponse(result);
                        });
                    }
                }  
                
                this.stripe.createPaymentMethod({
                    type: 'card',
                    card: this.cardElement,
                    billing_details: {
                    // Include any additional collected billing details.
                    name: 'Jenny Rosen',
                    },
                }).then(stripePaymentMethodHandler);                  
            },
            async testToken() {
                let token
                await this.stripe.createToken(this.cardElement).then((result) => {
                 console.log(result);
                 token = result
                });
                console.log(token);
                await this.$axios.$post('http://localhost:8000/api/stripe/token', JSON.stringify(token), {
                    headers: {
                    "content-type": "application/json",
                    },
                })
                .then((result) => {
                    console.log(result);
                });
            }
        },
        async mounted () {
                const stripeKey = await this.$axios.$get('http://localhost:8000/api/stripe/stripeKey')
                this.stripe = Stripe(stripeKey.key)
                const key = stripeKey.key 
                
                var elements = this.stripe.elements();

                var style = {
                    base: {
                        color: "#32325d",
                        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                        fontSmoothing: "antialiased",
                        fontSize: "16px",
                        "::placeholder": {
                        color: "#aab7c4"
                        }
                    },
                    invalid: {
                        color: "#fa755a",
                        iconColor: "#fa755a"
                    },
                };

                this.cardElement = elements.create('card', {style: style});
                this.cardElement.mount('#card-element-test');
        },
    }
</script>

<style lang="scss" scoped>

</style>