const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

const MESSAGE_FILE = "./messages.json";

// 🔹 mesajları dosyadan oku
let messages = [];
if (fs.existsSync(MESSAGE_FILE)) {
    const data = fs.readFileSync(MESSAGE_FILE, "utf-8");
    messages = JSON.parse(data);
}

io.on("connection", (socket) => {
    console.log("Bağlandı:", socket.id);

    // 🔹 eski mesajları gönder
    socket.emit("history", messages);

    socket.on("join", (username) => {
        socket.username = username || "Misafir";
    });

    socket.on("message", (text) => {
        if (!text.trim()) return;

        const msg = {
            user: socket.username || "Misafir",
            text,
            time: new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit"
            })
        };

        messages.push(msg);

        // 🔹 dosyaya yaz
        fs.writeFileSync(MESSAGE_FILE, JSON.stringify(messages, null, 2));

        io.emit("message", msg);
    });
});

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});

