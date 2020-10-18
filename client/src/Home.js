import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css"

export default function Home() {
  const [roomId, setRoomId] = useState("");

  return (
    <div className="home">
      <div className="title">
        <p>Home</p>
      </div>
      <div className="goto">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Create a room"
        />
        <button>
          <Link to={`/${roomId}`}>Enter Room</Link>
        </button>
      </div>
    </div>
  );
}
