const socket = io("/");

const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.classList.add("video");
myVideo.muted = true;

let peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "3000",
});

// Ask user access for media access
let myVideoStream = null;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    //2. Answer Call
    peer.on("call", (call) => {
      console.log(call);
      call.answer(stream);
      const video = document.createElement("video");
      //video.muted = true;
      video.classList.add("video");

      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => connectToNewUser(userId, stream));
  });

// Connect to the new user
//1. Call
const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  //video.muted = true;
  video.classList.add("video");

  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
};

// Messages
let message = document.getElementById("chat-message");
message.addEventListener("keydown", (e) => {
  if (e.which == 13 && message.value.length !== 0) {
    socket.emit("message", message.value);
    message.value = "";
  }
  scrollToBottom();
});

let messages = document.querySelector(".messages");
socket.on("create-message", (message) => {
  let list = document.createElement("li");
  list.classList.add("message");
  list.innerText = message;
  messages.append(list);
});

const scrollToBottom = () => {
  messages.scrollTop = messages.scrollHeight - messages.clientHeight;
};

// Buttons
const setUnmuteButton = () => {
  const html = `
    <i class="fa fa-microphone-slash btn-off"></i>
    <span class='btn-off'>Unmute</span>
  `;

  document.getElementById("mute-unmute").innerHTML = html;
};
const setMuteButton = () => {
  const html = `
    <i class="fa fa-microphone"></i>
    <span>Mute</span>
  `;

  document.getElementById("mute-unmute").innerHTML = html;
};

const setVideoOffButton = () => {
  const html = `
    <i class="fas fa-video-slash btn-off"></i>
    <span class='btn-off'>Play Video</span>
  `;

  document.getElementById("video-on-off").innerHTML = html;
};
const setVideoOnButton = () => {
  const html = `
    <i class="fa fa-video-camera"></i>
    <span>Stop Video</span>
  `;

  document.getElementById("video-on-off").innerHTML = html;
};

// Button Functionalities
//1. Un/Mute the video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
};
//2. Turn Video On Off
const videoOnOff = () => {
  const enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setVideoOffButton();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setVideoOnButton();
  }
};
