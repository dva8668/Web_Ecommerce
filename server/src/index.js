require("dotenv").config();
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const route = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

route(app);

// query db
// pool.query("SELECT * FROM user", (err, rows, fields) => {
//   if (err) throw err;
//   console.log(rows);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
