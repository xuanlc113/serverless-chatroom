import React, { useState } from "react";
import { useParams } from "react-router-dom";

export default function Room() {
  const [roomId, setRoomId] = useState(useParams().id);
  const [messages, setMessages] = useState([{ name: "abc", message: "hi" }]);

  return (
    <div className="chat">
      <div className="chat-box">
        {messages.map((message) => (
          <p>{message.message}</p>
        ))}
      </div>
      <div className="chat-input">
        <form>
          <input type="text" />
          <input type="file" />
          <button>Send</button>
        </form>
      </div>
    </div>
  );
}
