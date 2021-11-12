const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const app = express();
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connection with database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.znerx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database requests
async function run() {
  try {
    await client.connect();
    const database = client.db("getaway-tour-agency-database");
    const services = database.collection("services");
    const orders = database.collection("orders");

    app.get("/services", async (req, res) => {
      const cursor = services.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/my-orders", async (req, res) => {
      const cursor = orders.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    app.get("/place-order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.findOne(query);
      res.json(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await services.findOne(query);
      res.json(result);
    });

    app.post("/add-new-service", async (req, res) => {
      const newService = req.body;
      const result = await services.insertOne(newService);
      res.json(result);
    });

    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orders.deleteOne(query);
      res.json(result);
    });

    app.patch("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const updateDoc = {
        $set: {
          orderStatus: "Approved",
        },
      };
      const result = await orders.updateOne(query, updateDoc);
      res.json(result);
    });

    app.post("/new-order", async (req, res) => {
      const newOrder = req.body;
      console.log(newOrder);
      const result = await orders.insertOne(newOrder);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

// Checking backend functionality
app.get("/", (req, res) => {
  res.send("Backend Running");
});

app.listen(port, () => {
  console.log(`Success! Your application is running on port ${port}.`);
});
