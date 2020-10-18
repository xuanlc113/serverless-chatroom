import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [roomId, setRoomId] = useState("");

  return (
    <div>
      <p>Home</p>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <div className="room_button">
        <Link to={`/${roomId}`}>Enter Room</Link>
      </div>
    </div>
  );
}
