import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { App } from "./components";
import "./style/index.css";
import AuthProvider from "./components/AuthProvider";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <Router>
    <AuthProvider>
       <App />
    </AuthProvider>
  </Router>
);
