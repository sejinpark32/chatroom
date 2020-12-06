const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const rooms = {};
const allUsers = [];
const room = require('./custom_modules/room');
const user = require('./custom_modules/user');

app.get('*', (req, res) => {
    if(req.url == '/'){
        res.sendFile(__dirname + '/static/index.html');
    } else {
        res.sendFile(__dirname + `/static${req.url}`);
    }
});

io.on('connection', (socket) => {
    console.log('a user connected');

    //사용자객체생성
    let currentUser = user.create(socket);
    currentUser.enterRoom(rooms['waiting']);
    allUsers.push(currentUser);

    //연결하면 접속 가능한 방 리스트와 사용자리스트를 전송
    let roomInfo = [];
    let userInfo = [];

    for(let roomId in rooms){
        roomInfo.push({
            id: roomId,
            userSize: rooms[roomId].userSize()
        });
    }

    for (let u in allUsers){
        userInfo.push({
           userId: u.userId,
           nickName: u.nickName
        });
    }

    socket.send({
        sendType: 'wait',
        roomInfo: roomInfo,
        userInfo: userInfo
    });

    //채팅 이벤트 리스너 등록
    socket.on('chat message', (msg) => {

    });

    //연결이 끊어졌을때 해제 리스너 등록
    socket.on('disconnect', ()=> {
        //사용자가 접속해 있던 방 목록
        let currentUser = getUser(socket.id);
        let userRoomList = currentUser.roomList;

        //방목록에서 user삭제
        getUser(socket.id).leaveAll();

        //유저목록에서 삭제
        allUsers.splice(getUserIndex(socket.id), 1);

        //사용자가 접속해 있던 방에 나갔다고 공지
        userRoomList.forEach(roomId => {
            rooms[roomId].users.forEach(u => {
               u.socket.send({
                  roomId: roomId,
                  sendType: 'leave',
                  message: currentUser.nickName
               });
            });
        });

    });

    function getUser(userId) {
        return allUsers.find((u) => {
            return u.userId == userId;
        });
    }

    function getUserIndex(userId){
        return allUsers.findIndex((u) => u.userId == userId);
    }

});

http.listen(3000, ()=>{
    console.log('listening on *:3000');

    //서버가 뜨면 대기방을 생성
    let waitingRoom = room.create('waiting', user.create('admin'), '대기방', true);
    rooms['waiting'] = waitingRoom;
});