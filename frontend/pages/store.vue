<template>
    <div>
        <h1>VueX store</h1>
        <p>{{list}}</p>
        <p>{{doneTodos}}. The length is {{todoCount}} </p>
        <p>{{getTodoById('123456')}}</p>
        <v-text-field label="name fruit" v-model="item"></v-text-field>
        <v-btn @click="addItem">add</v-btn>
        <v-btn @click="addItemByPromise">add Promise</v-btn>
        <v-text-field label="rename" v-model="newName"></v-text-field>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
    export default {
        data() {
            return {
                item: ''
            }
        },
        computed: {
            ...mapState([
                'list'
            ]),
            ...mapGetters([
            'todoCount',
            'doneTodos',
            'getTodoById'
            // ...
            ]),
            newName: {
                get () {
                return this.list[0].name
                },
                set (value) {
                this.$store.commit('CHANGE_NAME', value)
                }
            }
        },
        methods: {
            ...mapMutations([
                'ADD_TO_LIST',
                'CHANGE_NAME'
            ]),
            ...mapActions([
                'AddByAction',
                'actionA',
                'actionB',
            ]),
            addItem() {
                // MUTATION
                /* this.ADD_TO_LIST({
                    id: '9876',
                    name: this.item,
                    category: 'fruit'
                }) */
                //ACTIONS
                this.AddByAction({
                    id: '9876',
                    name: this.item,
                    category: 'fruit'
                })
            },
            addItemByPromise() {
                // ACTIONS PROMISE To know when done or fail
                /* this.actionA({
                    id: '9876',
                    name: this.item,
                    category: 'fruit'
                }).then(() => {
                }) */
                this.actionB({
                    id: '9876',
                    name: this.item,
                    category: 'fruit'
                }).then(() => {
                    console.log('action A & B done, item banane change for ananas');
                }).catch(e => {
                    console.log(e);
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>