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
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
    } else {
      const url = `wss://89rqvefb8d.execute-api.ap-southeast-1.amazonaws.com/dev`;
      ws.current = new WebSocket(url);
      ws.current.onopen = () => {
        ws.current.send(
          JSON.stringify({ action: "join", room, username: user })
        );
        ws.current.send(JSON.stringify({ action: "history", room }));
      };
      ws.current.onclose = () => {
        //try reconnect
      };
      ws.current.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        console.log(payload);
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
          case "PONG":
            break;
        }
      };
    }
  }, [popup]);

  useEffect(() => {
    const interval = setInterval(() => {
      ws.current.send(JSON.stringify({ action: "PING" }));
    }, 540000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="room">
      {popup && <Popup user={user} setUser={setUser} setPopup={setPopup} />}
      <Sidebar participants={participants} wsref={ws} />
      <Chat user={user} messages={messages} room={room} wsref={ws} />
    </div>
  );
}
