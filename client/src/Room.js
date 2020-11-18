import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import Popup from "./Popup";
import Sidebar from "./Sidebar";
import "./Room.css";

export default function Room() {
  const [popup, setPopup] = useState(true);
  const [roomId, setRoomId] = useState(useParams().id);
  const [user, setUser] = useState("user1");
  const [participants, setParticipants] = useState(["sdsad", "esr"]);

  useEffect(() => {
    // update server-side, not client
    // client updates from websocket
  }, [popup]);

  return (
    <div className="room">
      {popup && <Popup user={user} setUser={setUser} setPopup={setPopup}/>}
      <Sidebar participants={participants}/>
      <Chat user={user}/>
    </div>
  );
}
