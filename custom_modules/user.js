class user {

    constructor(socket) {
        this.userId = socket.id.substring(0, 5);
        this.nickName = socket.id.substring(0, 5);
        this.accessedAt = new Date();
        this.roomList = [];
        this.socket = socket;
    }

    enterRoom(room){
        room.addUser(this);
        this.roomList.push(room);
    }

    leaveRoom(roomId){
        let index = this.roomList.findIndex(room => room.roomId() === roomId);
        this.roomList[index].removeUser(this.userId);
    }

    leaveAll(){
        this.roomList.forEach(room => room.removeUser(this.userId));
    }

    changeNickname(newNickName){
        this.nickName = newNickName;
    }
}

function create(socket){
    return new user(socket);
}

exports.create = create;