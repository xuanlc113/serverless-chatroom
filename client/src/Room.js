import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Chat from "./Chat";
import Popup from "./Popup";
import Sidebar from "./Sidebar";
import "./Room.css";

export default function Room() {
  const room = useParams().id;
  const [popup, setPopup] = useState(true);
  const [user, setUser] = useState("");
  const [participants, setParticipants] = useState([]);
  const [messages, setMessages] = useState([]);
  const ws = useRef();

  useEffect(() => {
    // const url = `wss:e06vdkebt9.execute-api.ap-southeast-1.amazonaws.com/dev/?room=${room}`;
    const url = "wss:weboscket";
    ws.current = new WebSocket(url);
    ws.current.onopen = () => {
      ws.current.send({ action: "join", room, username: user }); // update particiants for all
      ws.current.send({ action: "history", room }); // get room history
    };
    ws.current.onclose = () => {
      //try reconnect
    };
    ws.current.onmessage = (event) => {
      console.log(event);
      const payload = JSON.parse(event);
      switch (payload.type) {
        case "message":
          setMessages((prev) => [...prev, payload.data]);
          break;
        case "join":
          setParticipants(payload.data);
          break;
        case "history":
          setMessages(payload.data);
          break;
        default:
          //pong
          break;
      }
    };
  }, [popup]);

  return (
    <div className="room">
      {popup && <Popup user={user} setUser={setUser} setPopup={setPopup} />}
      <Sidebar participants={participants} />
      <Chat user={user} messages={messages} wsref={ws} />
    </div>
  );
}
