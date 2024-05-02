import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import UploadDocument from "./UploadDocument";
import FindDocument from "./FindDocument";
import * as icons from "bootstrap-icons/font/bootstrap-icons.css";
import './App.css';
import logo from "./images/logo-asi.png";

function LandingPage() {
  return (
    <>
      <div className="header">
        <img src={logo} alt="" id="asi-logo"/>
      </div>
      <div className="home-body">
        <div className="menu">
          EQUIPMENT<br />MANAGEMENT SYSTEM
          <div className = "buttons">
            <div id="upload-div">
              <Link to="/upload-document"><button id="uploadbutton"><i className="bi bi-cloud-upload" /></button></Link>
              <br/>Upload Document
            </div>
            <div id="find-div">
              <Link to="/find-document"><button id="findbutton"><i className="bi bi-search" /></button></Link>
              <br/>Search Document
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/upload-document" element={<UploadDocument />} />
          <Route path="/find-document" element={<FindDocument />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
