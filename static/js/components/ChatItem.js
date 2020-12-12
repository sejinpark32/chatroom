import message from "./Message.js";

export default {
    name: 'ChatItem',
    template: '<ul><message v-for="(item, index) in chat" v-bind:msg="item" v-bind:key="index"></message></ul>',
    props: {
        chat: {
            type: Array,
            default: []
        }
    },
    components: {
        message: message
    }
}