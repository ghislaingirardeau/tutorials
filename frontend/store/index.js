
// holds your root state
export const state = () => ({
    user: undefined,
    list: [
        {
            id: '123',
            name: 'banane',
            category: 'fruit'
        },
        {
            id: '1234',
            name: 'pomme',
            category: 'fruit'
        },
        {
            id: '12345',
            name: 'carot',
            category: 'legume'
        },
        {
            id: '123456',
            name: 'tomate',
            category: 'legume'
        }
    ],
    authenticated: true
})

// contains your actions
export const actions = {
    AddByAction(context, item) {//item from the methods arguments
        /* console.log(context.getters, context.state); */ // acces to the state and getters here
        context.commit('ADD_TO_LIST', item)
    },
    // WITH A PROMISE, to know in the methods when the action is done
    actionA({ commit, state, getters }, item) { 
        /* console.log(state, getters); */
        return new Promise((resolve, reject) => {
            commit('ADD_TO_LIST', item)
            resolve()
        })
    },
    async actionB({ dispatch, commit }, item) {
        await dispatch('actionA', item).then(() => { // wait actionA is RESOLVE to do action B
            commit('CHANGE_NAME')
        })
    },
    // FIREBASE PAGE
    async currentUser(context, formData) {
        try {
            let userLog = await this.$fire.auth.signInWithEmailAndPassword(
                formData.email,
                formData.password
            );
            // LISTENER TO THE AUTH CHANGED IF STILL LOG OR NOT
            this.$fire.auth.onAuthStateChanged((user) => {
                if (user) {
                    const uid = user.uid;
                    console.log(user, uid);
                } else {
                    console.log("User is signed out");
                }
            });
            // this.$fire.auth.currentUser; => to know if user currently connected
            console.log(
                "Login success",
                "add the redirect log page when log",
                userLog.user
            );
            context.commit('USER_FECTH', userLog.user)
        } catch (e) {
            console.log("This email or password doesn't exist");
        }
    },
}
// contains your mutations
export const mutations = {
    ADD_TO_LIST(state, item) {
        state.list.push(item)
    },
    CHANGE_NAME(state, value = "Ananas") {
        state.list[0].name = value
    },
    BLOCK_FECTH(state) {
        state.authenticated = !state.authenticated
    },
    // FIREBASE PAGE
    USER_FECTH(state, authUser) {
        const { uid, email, emailVerified } = authUser
        state.user = { uid, email, emailVerified }
    },
}
// your root getters = if I want to compute the state and send the result already
// ex: if i want a list from a specify id
export const getters = {
    doneTodos(state) {
        return state.list.filter(elt => elt.category === 'fruit')
    },
    todoCount(state, getters) { // put 2nd argument to get a getter and compute as well
        return getters.doneTodos.length
    },
    getTodoById: (state) => (id) => { // pass a method, id will be pass as an argument
        return state.list.find(elt => elt.id === id)
    }
}