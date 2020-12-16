export default {
    name: 'message',
    template: '<li><span class="text-primary">{{msg.userNickname}}[{{msg.userId}}]</span>: {{msg.text}}</li>',
    props: {
        msg: {
            type: Object,
            default: {}
        }
    }
}