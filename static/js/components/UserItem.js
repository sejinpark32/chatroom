export default {
    name: 'UserItem',
    template: '<li class="list-group-item">{{user.nickName}}({{user.userId}})</li>',
    props: {
        user: {
            type: Object,
            default: {}
        }
    }
}