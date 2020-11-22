import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import "./Home.css";

function Home(props) {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(false);

  function submitHandler(event) {
    const reg = new RegExp("[a-zA-Z0-9]{4,}");
    if (!reg.test(roomId)) {
      event.preventDefault();
      setError(true);
    } else {
      props.history.push(`/${roomId}`);
    }
  }

  return (
    <div className="home">
      <div className="title">
        <p>Chat</p>
      </div>
      <form onSubmit={submitHandler} className="to-room-form">
        <div className="to-room-input-block">
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Create a room"
            className={"to-room-input" + (error ? " error" : "")}
          />
          {error && (
            <p className="to-room-error">
              Please enter at least 4 alphanumeric characters
            </p>
          )}
        </div>
        <button className="to-room-button">Enter Room</button>
      </form>
    </div>
  );
}

export default withRouter(Home);
