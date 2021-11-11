const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znerx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("getaway-tour-agency-database");
    const services = database.collection("services");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});
