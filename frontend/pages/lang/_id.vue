<template>
    <div>
        <h1>
            page en {{this.$route.params.id}}
        </h1>
    </div>
</template>

<script>
export default {
    layout: "langLayout",
    data () {
        return {
            localBackend: '',
            lang: 'fr',
            value: '',
            items: [
                'fr',
                'en'
            ]
        }
    },
    mounted () {
        /* const body = {
            lang: this.lang
        }
        await this.$axios.$post('http://localhost:8000/api/i18n', JSON.stringify(body), {
            headers: {
            "content-type": "application/json",
            },
        })
        .then(response => {
            this.localBackend = response
        }) */
        
    },
}
</script>

<style lang="scss" scoped>

</style>