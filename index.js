const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data.json");

// New middleware setup
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("dev"));
app.use(bodyParser.json());

// Initialize data file if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    await fs.writeFile(DATA_FILE, JSON.stringify({}));
  }
}

// CRUD Operations
app.get("/api/:entity", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE));
    const entity = data[req.params.entity] || [];
    res.json(entity);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/:entity/:id", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE));
    const entity = data[req.params.entity] || [];
    const item = entity.find((i) => i.id === req.params.id);
    item ? res.json(item) : res.status(404).json({ error: "Item not found" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/:entity", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE));
    const entity = req.params.entity;

    if (!data[entity]) {
      data[entity] = [];
    }

    const newItem = {
      id: uuidv4(),
      ...req.body,
    };

    data[entity].push(newItem);
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/api/:entity/:id", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE));
    const entity = data[req.params.entity] || [];
    const index = entity.findIndex((i) => i.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    const updatedItem = {
      ...entity[index],
      ...req.body,
      id: req.params.id, // Ensure ID remains the same
    };

    entity[index] = updatedItem;
    data[req.params.entity] = entity;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/api/:entity/:id", async (req, res) => {
  try {
    const data = JSON.parse(await fs.readFile(DATA_FILE));
    const entity = data[req.params.entity] || [];
    const filtered = entity.filter((i) => i.id !== req.params.id);

    if (entity.length === filtered.length) {
      return res.status(404).json({ error: "Item not found" });
    }

    data[req.params.entity] = filtered;
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add this above the initializeDataFile().then() block
const ASCII_ART = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ MinionDoc API Server Started! █
█      Now serving requests      █
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`;

// Update server startup logs
initializeDataFile().then(() => {
  app.listen(PORT, () => {
    console.log(ASCII_ART);
    console.log(`🦸♂️  Server running on port ${PORT}`);
    console.log(`📁 Data file: ${DATA_FILE}`);
    console.log(`🌐 CORS enabled for all origins`);
    console.log(`📝 Request logging activated`);
  });
});
