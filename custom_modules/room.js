class Room {

    constructor(roomId, user, roomName, isPublic, password) {
        this.roomId = roomId;
        this.isPublic = isPublic;
        this.roomName = roomName;

        if(isPublic === undefined) {
            this.isPublic = true;
        } else if (isPublic === false){
            this.password = password;
        }

        this.users = [user];
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

function create(roomId, userId, isPublic, password){
    return new Room(roomId, userId, isPublic, password);
}

exports.create = create;