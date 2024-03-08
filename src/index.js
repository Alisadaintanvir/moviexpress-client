import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./components/App1";
// import StarRating from "./components/StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      maxRating={5}
      size={50}
      message={["Very Bad", "Bad", "Okay", "Good", "Very Good"]}
      defaultRating={3}
    /> */}
  </React.StrictMode>
);
