const socket = io.connect('212.154.2.202:80')
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '212.154.2.202',
    port: 3001
})
const videom = document.createElement('video')
videom.muted = true
const peers = {}

navigator.mediaDevices.getUserMedia({
    video: true, audio: true
}).then(stream => {
    addVideoStream(videom, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        connectToNewUser(userId, stream)
    })

    
})
socket.on('user-disconnected', userId => {
    if(peers[userId]) peers[userId].close()
})
myPeer.on('open', id => {
    socket.emit('join-room', ODA_ID, id)
})

socket.on('user-connected', userId => {
    console.log(userId + "id' li kullanıcı bağlandı.")
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}
