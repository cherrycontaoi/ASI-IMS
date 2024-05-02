import React, { useState, useEffect } from "react";
import './FindDocument.css'
import logo from "./images/logo-asi.png";
import * as XLSX from 'xlsx'; // Import xlsx library for Excel manipulation

const API_BASE = "http://localhost:3001";

function FindDocument() {
  const [documents, setDocuments] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = () => {
    fetch(API_BASE + "/documents")
      .then((res) => res.json())
      .then((data) => {
        setDocuments(data);
        setFilteredDocuments(data); // Initialize filtered documents with all documents
      })
      .catch((err) => console.error("Error: ", err));
  };

  const handleViewDocument = async (documentId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/document/${documentId}/view`
      );
      const blob = await response.blob(); // Get the file as a Blob
      const url = URL.createObjectURL(blob); // Create a URL for the Blob
      window.open(url); // Open the file in a new tab
    } catch (error) {
      console.error("Error viewing document:", error.message);
    }
  };

  const handleSearch = () => {
    const lowercaseKeyword = searchKeyword.toLowerCase();
    const filteredDocs = documents.filter((doc) => {
      const lowercaseName = doc.uploaderName ? doc.uploaderName.toLowerCase() : "";
      const lowercaseType = doc.documentType ? doc.documentType.toLowerCase() : "";
      const lowercaseDescription = doc.description ? doc.description.toLowerCase() : "";
      return (
        lowercaseName.includes(lowercaseKeyword) ||
        lowercaseType.includes(lowercaseKeyword) ||
        lowercaseDescription.includes(lowercaseKeyword)
      );
    });
    setFilteredDocuments(filteredDocs);
  };

  const generateExcel = () => {
    // Convert documents data to Excel format
    const excelData = filteredDocuments.map((document) => ({
      "Document Type": document.documentType,
      "Document Number": document.documentNumber,
      "Name": document.uploaderName,
      "Description": document.description,
      "Date Acquired": document.dateAcquired ? document.dateAcquired.split("T")[0] : "",
      "Quantity": document.quantity
    }));

    // Create a new workbook and add a worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Uploaded Documents");

    // Generate Excel file and download it
    XLSX.writeFile(wb, "[ASI-EMS] Uploaded-Documents.xlsx");
  };

  return (
    <>
        <div className="header">
                <img src={logo} alt="" id="asi-logo"/>
            </div>
        <div className="docs-body">

        <a href="/">Return to Homepage</a>
            <div className="document-list">
                <div className="title-part">
                    <p id="uploaded-docs-text">Uploaded Documents</p>
                    <button onClick={generateExcel} id="generate-excel-button">GENERATE EXCEL</button>
                </div>
                
                <div className = "search-doc">
                    <input
                        id="search-field"
                        type="text"
                        placeholder="Search by document name, type, or description"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />

                    <button onClick={handleSearch} id="search-button">SEARCH</button>

                </div>
                <ul className="list-of-docs">
                    <br />
                    {filteredDocuments.map((document) => (
                    <div key={document._id} id="uploaded-doc-line">

                        <div className = "doc-number">
                            {document.documentNumber}
                        </div>

                        <div className = "doc-field">
                            <p>
                                {document.uploaderName}
                            </p>
                        </div>

                        <div className="doc-field">
                            <p>
                                {document.documentType}
                            </p>   
                        </div>

                        <div className="doc-field">
                            <p>
                                {document.description}
                            </p>
                        </div>

                        <div className="doc-field">
                            <button className="view-button" onClick={() => handleViewDocument(document._id)}>
                                View Document
                            </button>
                        </div>
                        
                    </div>
                    ))}
                </ul>

            </div>

        </div>
        
    </>
  );
}

export default FindDocument;
