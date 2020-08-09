const socket = io('/');

const videoGrid = document.getElementById('video-grid');

const myVideo = document.createElement('video');
myVideo.muted = true;
myVideo.classList.add('video');

let peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3000'
});

// Ask user access for media access
let myVideoStream = null;
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream);

  //2. Answer Call
  peer.on('call', call => {
    console.log(call);
    call.answer(stream);
    const video = document.createElement('video');
    video.muted = true;
    video.classList.add('video');

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream);
    })
  })

  socket.on('user-connected', (userId) => connectToNewUser(userId, stream));
});

// Connect to the new user
//1. Call
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement('video');
  video.muted = true;
  video.classList.add('video');

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream);
  })
}

peer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id);
})


const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  })

  videoGrid.append(video);
}