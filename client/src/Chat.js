import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import "./Chat.css";
import MessageText from "./MessageText";

export default function Chat(props) {
  const [roomId, setRoomId] = useState(useParams().id);
  const [messages, setMessages] = useState([
    { name: "abc", message: "The first message" }, 
    { name: "abc", message: "hi. this is the next message" }
  ]);
  const [message, setMessage] = useState("");
  const anchor = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    if (message != "") {
      setMessages(prev => [...prev, {name: props.user, message: message}]);
      setMessage("");
    }
  }

  useEffect(() => {
    anchor.current.scrollIntoView();
  }, [messages])

  return (
    <div className="chat">
      <div className="chat-box">
        {messages.map((message) => (
          <MessageText user={props.user} name={message.name} message={message.message} />
        ))}
        <div className="chat-anchor" ref={anchor}/>
      </div>
      <div className="chat-input">
        <form className="chat-form" onSubmit={(e) => submitHandler(e)}>
          <TextareaAutosize 
            className="chat-textbox" 
            onChange={e => setMessage(e.target.value)} 
            value={message}
            maxRows={4}
          />
          {/* <input type="file" /> */}
          <button className="char-send-button" type="submit">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="icon icon-tabler icon-tabler-send" 
              width="44" 
              height="44" 
              viewBox="0 0 24 24" 
              stroke-width="1.5" 
              stroke="#2196F3" 
              fill="none" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
              <line x1="10" y1="14" x2="21" y2="3" />
              <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
