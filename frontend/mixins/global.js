export default {
    data() {
        return {
            testname: 'gigi',
            testlast: 'girard',
            revealMixinData: false
        }
    },
    computed: {
        testfullname() {
            return `My fullname is ${this.testname} ${this.testlast}`
        },
    },
    methods: {
        revealMixinFct() {
            this.revealMixinData = !this.revealMixinData
        }
    }
}