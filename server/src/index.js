require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const route = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var debug = require("debug")("demopaymentnodb:server");
var http = require("http");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(methodOverride("_method"));

route(app);

var server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  ///Handle khi có connect từ client tới
  console.log("New client connected!");

  socket.on("sendDataClient", function ({ newDate, cartSelect }) {
    // Handle khi có sự kiện tên là sendDataClient từ phía client
    io.emit("sendDataServer", { newDate, cartSelect }); // phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

server.on("listening", onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}
