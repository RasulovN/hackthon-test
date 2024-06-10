const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// MongoDB ga ulanish
mongoose.connect("mongodb://localhost:27017/inventory", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use('/api', require('./routes/post.route'))

app.listen(port, () => {
  console.log(`Server on port http://localhost:${port}`);
});
