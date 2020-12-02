import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import dotenv from "dotenv";

dotenv.config();
console.log(process.env.REACT_APP_WEBSOCKET_URL);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
