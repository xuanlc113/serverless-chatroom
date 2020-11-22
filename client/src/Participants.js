import React from "react";

export default function Participants(props) {
  return (
    <>
      <p className="participants-header">Participants</p>
      <div className="participants-list">
        {props.participants.map((name) => (
          <Tab name={name} />
        ))}
      </div>
    </>
  );
}

function Tab(props) {
  return (
    <div className="participant-info">
      <p>{props.name}</p>
    </div>
  );
}
