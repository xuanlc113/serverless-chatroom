import React from "react";
import "./MessageText.css";

export default function MessageText(props) {
    return (
        <div className={"message-container " + 
            (props.user == props.name ? "user" : "")}
        >
            <div className={"message-pad " + 
            (props.user == props.name ? "user" : "")}>
                <p className="message-name">{props.name}</p>
                <p className="message-text">{props.message}</p>
            </div>
        </div>
    )
}