import React from "react";
import { Link } from "react-router-dom";
import Participants from "./Participants";
import "./Sidebar.css";

export default function Sidebar(props) {
  function closeSocket() {
    if (props.wsref.current) {
      props.wsref.current.close();
    }
  }

  return (
    <div className="sidebar">
      <Participants participants={props.participants} />
      <Link to="/" className="room-exit-button" onClick={() => closeSocket()}>
        <div>Exit Room</div>
      </Link>
    </div>
  );
}
