import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Chat from "./Chat";
import Popup from "./Popup";

export default function Room() {
  const [popup, setPopup] = useState(true);
  const [roomId, setRoomId] = useState(useParams().id);
  const [username, setUsername] = useState("");

  useEffect(() => {

  }, [popup]);

  return (
    <div className="room">
      {popup && <Popup username={username} setUsername={setUsername} setPopup={setPopup}/>}
      <div className="sidebar">
        <p>Room, {roomId}. Hi, {username}</p>
        <Link to="/">Home</Link>
      </div>
      <div className="chat">
        <Chat />
      </div>
    </div>
  );
}
