const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    documentType: {
        type: String,
        required: true
    },
    documentNumber: {
        type: Number,
        required: true
    },
    uploaderName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dateAcquired: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true 
    },
    documentCopy: {
        data: Buffer,
        contentType: String
    }
});

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;