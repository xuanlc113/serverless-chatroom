import React from "react";
import { Link } from "react-router-dom";
import Participants from "./Participants";
import "./Sidebar.css";

export default function Sidebar(props) {
  return (
    <div className="sidebar">
      <Participants participants={props.participants} />
      <Link to="/" className="room-exit-button">
        <div>Exit Room</div>
      </Link>
    </div>
  );
}
