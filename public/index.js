//import { io } from 'socket.io-client';

//room ids
const newRoomI = document.getElementById("newRoomI");
const newRoomBtn = document.getElementById("newRoomBtn");
const roomEl = document.getElementById("roomEl");
//username id
const usernameEl = document.getElementById("usernameEl");
//message ids
const chatRoomCn = document.getElementById("chatRoomCn");
const chatEl = document.getElementById("chatEl");
const chatInputI = document.getElementById("chatInputI");
const sendBtn = document.getElementById("sendBtn");
const sendingMessageEl = document.getElementById("sendingMessageEl");

let username = "Guest";
let room = null;
let onAlternateMessage = false;
let message = "";

// Make sure your server is running on the right URL and port!
const socket = io("http://localhost:3000"); // fixed the URL typo here

// Listen for connection confirmation
socket.on("connect", () => {
  console.log("Connected to server with id:", socket.id);
});

// Listen for incoming chat messages from server
socket.on("chat message", (data) => {
  // data should contain { username, message }
  displayMessage(data.username, data.message);
});

// Function to display message in chat UI
function displayMessage(sender, message) {
  const div = document.createElement("div");
  const usernamePInMessageEl = document.createElement("p");
  const messageContentEl = document.createElement("p");

  onAlternateMessage
    ? div.classList.add("alternateChatMessageCn")
    : div.classList.add("chatMessageCn");

  usernamePInMessageEl.textContent = sender;
  usernamePInMessageEl.classList.add("chatMessageNameEl");
  messageContentEl.textContent = message;
  messageContentEl.classList.add("chatMessageEl");

  div.appendChild(usernamePInMessageEl);
  div.appendChild(messageContentEl);

  chatEl.appendChild(div);

  onAlternateMessage = !onAlternateMessage;
}

// Sending messages - update message variable when input changes
chatInputI.addEventListener("change", function () {
  message = chatInputI.value;
  console.log("Message input changed:", message);
});

// Send message on button click
sendBtn.addEventListener("click", function () {
  sendMessage(message);
});

function sendMessage(message) {
  if (message === "") {
    return;
  }

  if (!room) {
    alert("Please join a room first!");
    return;
  }

  // Send message data to server, including username and room
  socket.emit("chat message", {
    room,
    username,
    message,
  });

  // Optionally display your own message immediately
  // You can comment this out if you want to only show messages from server
  displayMessage(username, message);

  chatInputI.value = "";
  message = "";
}

// Change username
usernameEl.addEventListener("change", function () {
  if (usernameEl.value === "") {
    username = "Guest";
    return;
  }
  username = usernameEl.value;
});

// Join room on button click
newRoomBtn.addEventListener("click", function () {
  if (newRoomI.value === "") {
    return;
  }
  room = newRoomI.value;
  roomEl.textContent = room;
  newRoomI.value = "";

  // Tell server you want to join the room
  socket.emit("join room", room);
  console.log("Joined room:", room);

  // Clear chat when joining a new room
  chatEl.innerHTML = "";
});
