const socket = io();

const username = prompt("Kullanıcı adın:") || "Misafir";
socket.emit("join", username);

const messages = document.getElementById("messages");
const input = document.getElementById("messageInput");
const button = document.getElementById("sendBtn");

button.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});

function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    socket.emit("message", text);
    input.value = "";
}

socket.on("history", (oldMessages) => {
    oldMessages.forEach(addMessage);
});

socket.on("message", (msg) => {
    addMessage(msg);
});

function addMessage(msg) {
    const div = document.createElement("div");
    div.innerHTML = `<b>${msg.user}</b> (${msg.time}): ${msg.text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}
