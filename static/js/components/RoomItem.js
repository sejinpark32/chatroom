export default {
    name: 'RoomItem',
    template: '<li class="list-group-item">{{room.id}}({{room.userSize}})</li>',
    props: {
        room: {
            type: Object,
            default: {}
        }
    }
}