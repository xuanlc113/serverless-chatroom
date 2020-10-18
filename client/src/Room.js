import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chat from "./Chat";

export default function Room() {
  const [roomId, setRoomId] = useState(useParams().id);
  return (
    <div className="room">
      <div className="sidebar">
        <p>Room, {roomId}</p>
        <Link to="/">Home</Link>
      </div>
      <div className="chat">
        <Chat />
      </div>
    </div>
  );
}
