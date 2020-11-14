import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Participants from "./Participants";

export default function Sidebar(props) {
    return (
        <div className="sidebar">
            <p>Room, {props.roomId}. Hi, {props.username}</p>
            <Participants participants={props.participants}/>
            <Link to="/">Home</Link>
        </div>
    );
}