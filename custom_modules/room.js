class Room {

    constructor(roomId, user, roomName, isPublic, password) {
        this.roomId = roomId;
        this.isPublic = isPublic;
        this.roomName = roomName;
        this.users = [];

        if(isPublic === undefined) {
            this.isPublic = true;
        } else if (isPublic === false){
            this.password = password;
        }

        if(user !== undefined){
            this.users.push(user);
        }

        this.created = new Date();
    }

    addUser(user){
        this.users.push(user);
    }

    removeUser(userId){
        let index = this.users.findIndex((user) => user.userId === userId);
        this.users.splice(index, 1);
    }

    userSize(){
        return this.users.length;
    }
}

function create(roomId, user, isPublic, password){
    return new Room(roomId, user, isPublic, password);
}

exports.create = create;