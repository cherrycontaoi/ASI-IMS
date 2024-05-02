const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

// Configure multer for file uploads
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // Max file size: 20MB
});

app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/asi-documents", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to the DB"))
  .catch(console.error);

const Document = require("./models/Document");

app.get("/documents", async (req, res) => {
  const documents = await Document.find();
  res.json(documents);
});

// Handle file upload
app.post("/document/new", upload.single("documentCopy"), async (req, res) => {
  try {
    const document = new Document({
      documentType: req.body.documentType,
      documentNumber: req.body.documentNumber,
      uploaderName: req.body.uploaderName,
      description: req.body.description,
      dateAcquired: req.body.dateAcquired,
      quantity: req.body.quantity,
      documentCopy: {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      },
    });

    await document.save();

    // Replace 'documentData' with the actual document data you want to encode
    const documentData = document.documentCopy.data;

    // Convert the document data to a Base64 string
    const base64DocumentData = Buffer.from(documentData).toString('base64');

    // Send the Base64-encoded document data to the client
    res.json({ documentData: base64DocumentData });
  } catch (error) {
    console.error("Error adding document:", error.message);
    res.status(500).json({ error: "Failed to add document" });
  }
});

// for deleting an entry
app.delete("/document/delete/:id", async (req, res) => {
  const result = await Document.findByIdAndDelete(req.params.id);
  res.json(result);
});

app.get("/document/:id/view", async (req, res) => {
    try {
      // Retrieve the document from the database based on the provided ID
      const document = await Document.findById(req.params.id);
  
      // Check if the document exists
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
  
      // Set the Content-Type header based on the type of document being served
      res.set("Content-Type", document.documentCopy.contentType);
  
      // Send the document data in the response
      res.send(document.documentCopy.data);
    } catch (error) {
      console.error("Error serving document:", error.message);
      res.status(500).json({ error: "Failed to serve document" });
    }
  });

app.listen(3001, () => console.log("Server started on Port 3001"));
