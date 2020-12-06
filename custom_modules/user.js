class user {

    constructor(socket) {
        this.userId = socket.id;
        this.nickName = socket.id;
        this.accessedAt = new Date();
        this.roomList = [];
        this.socket = socket;
    }

    enterRoom(room){
        room.addUser(user);
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

function create(userId, nickName){
    return new user(userId, nickName);
}

exports.create = create;