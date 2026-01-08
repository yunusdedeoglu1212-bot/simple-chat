const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("Bağlanan socket:", socket.id);

    socket.on("join", (username) => {
        socket.username = username || "Misafir";
        console.log("Kullanıcı adı:", socket.username);
    });

    socket.on("message", (text) => {
        const time = new Date().toLocaleTimeString("tr-TR", {
            hour: "2-digit",
            minute: "2-digit"
        });

        io.emit("message", {
            user: socket.username || "Misafir",
            text,
            time
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});
