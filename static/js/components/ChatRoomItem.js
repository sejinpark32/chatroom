export default {
    name: 'ChatRoomItem',
    template: '<li class="nav-item"><a class="nav-link active">{{room}}</a></li>',
    props: {
        room: {
            type: String,
            default: ''
        }
    }
}