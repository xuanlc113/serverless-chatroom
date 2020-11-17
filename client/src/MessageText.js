import React from "react";
import "./MessageText.css";

export default function MessageText(props) {
    return (
        <div>
            <div className="message-container">
                <p className="message-name">{props.user}</p>
                <p className="message-text">{props.message}</p>
            </div>
        </div>
    )
}