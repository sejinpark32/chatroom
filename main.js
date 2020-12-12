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

    //연결하면 접속 가능한 방 리스트와 사용자리스트를 전송
    let roomInfo = {};
    let userInfo = [];

    for(let roomId in rooms){
        roomInfo[roomId] = {
            id: roomId,
            userSize: rooms[roomId].userSize(),
            roomName: rooms[roomId].roomName
        };
    }

    //이미 접속해있던 사람들에게 새로 입장한 사용자 정보 공지
    allUsers.forEach(u => {
        u.socket.send({
            sendType: 'enter',
            userId: currentUser.userId,
            nickName: currentUser.nickName,
            roomId: 'waiting'
        });

        userInfo.push({
            userId: u.userId,
            nickName: u.nickName
        });
    });

    //본인은 제외하고 보냄
    allUsers.push(currentUser);

    socket.send({
        sendType: 'wait',
        roomInfo: roomInfo,
        userInfo: userInfo,
        myId: currentUser.userId,
        myNickName: currentUser.nickName
    });

    //채팅 이벤트 리스너 등록
    socket.on('send', (msg) => {
        let roomId = msg.roomId;
        msg.sendType = 'chat';

        rooms[roomId].users.forEach((u)=>{
           u.socket.send(msg);
        });

    });

    //연결이 끊어졌을때 해제 리스너 등록
    socket.on('disconnect', ()=> {
        let userId = socket.id.substring(0, 5);
        //사용자가 접속해 있던 방 목록
        let currentUser = getUser(userId);
        let userRoomList = currentUser.roomList;

        //방목록에서 user삭제
        getUser(userId).leaveAll();

        //유저목록에서 삭제
        allUsers.splice(getUserIndex(userId), 1);

        //사용자가 접속해 있던 방에 나갔다고 공지
        userRoomList.forEach(r => {
            r.users.forEach(u => {
                u.socket.send({
                    sendType: 'leave',
                    roomId: r.roomId,
                    userNickName: currentUser.nickName,
                    userId: currentUser.userId
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
    let waitingRoom = room.create('waiting', undefined, '대기방', true);
    rooms['waiting'] = waitingRoom;
});