import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { IconSend, IconFile, IconX } from "@tabler/icons";
import "./Chat.css";
import Message from "./Message";

export default function Chat(props) {
  // const [roomId, setRoomId] = useState(useParams().id);
  const [messages, setMessages] = useState([
    { name: "abc", message: "The first message", type: "text" },
    { name: "abc", message: "hi. this is the next message", type: "text" },
    { name: "abc", filename: "test_file1.txt", filesize: "256", type: "file" },
  ]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const anchor = useRef();
  const fileUpload = useRef();
  const send = useRef();

  useEffect(() => {
    anchor.current.scrollIntoView();
  }, [messages]);

  function changeFile(event) {
    setFile(event.target.files[0]);
    fileUpload.current.value = "";
    setMessage("");
  }

  function submitHandler(event) {
    event.preventDefault();
    if (message != "") {
      sendMessage();
    } else if (file != null) {
      sendFile();
    }
  }

  function sendMessage() {
    setMessages((prev) => [
      ...prev,
      { name: props.user, message: message, type: "text" },
    ]);
    setMessage("");
  }

  function sendFile() {
    setMessages((prev) => [
      ...prev,
      { name: props.user, filename: file.name, filesize: 10, type: "file" },
    ]);
    setFile(null);
  }

  return (
    <div className="chat">
      <div className="chat-container">
        {messages.map((message) => (
          <Message user={props.user} {...message} />
        ))}
        <div className="chat-anchor" ref={anchor} />
      </div>
      <div className="chat-input">
        <form className="chat-form" onSubmit={submitHandler}>
          <input
            type="file"
            ref={fileUpload}
            style={{ display: "none" }}
            onChange={(e) => changeFile(e)}
          />
          <IconFile
            className="chat-icon file"
            onClick={() => fileUpload.current.click()}
          />

          {file != null ? (
            <div className="chat-file-box">
              <p>{file.name}</p>
              <IconX
                className="chat-icon close"
                onClick={() => setFile(null)}
              />
            </div>
          ) : (
            <TextareaAutosize
              className="chat-textbox"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              maxRows={4}
            />
          )}

          <button type="submit" style={{ display: "none" }} ref={send} />
          <IconSend
            className="chat-icon send"
            onClick={() => send.current.click()}
          />
        </form>
      </div>
    </div>
  );
}
