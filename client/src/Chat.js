import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { IconSend, IconFile, IconX } from "@tabler/icons";
import "./Chat.css";
import Message from "./Message";

export default function Chat(props) {
  // const [messages, setMessages] = useState([
  //   { name: "abc", message: "The first message", type: "text", time: "0010" },
  //   {
  //     name: "abc",
  //     message: "hi. this is the next message",
  //     type: "text",
  //     time: "0011",
  //   },
  //   {
  //     name: "abc",
  //     filename: "test_file1.txt",
  //     filesize: "256",
  //     type: "file",
  //     time: "0012",
  //   },
  // ]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const anchor = useRef();
  const fileUpload = useRef();
  const send = useRef();

  useEffect(() => {
    anchor.current.scrollIntoView();
  }, [props.messages]);

  function changeFile(event) {
    setFile(event.target.files[0]);
    fileUpload.current.value = "";
    setMessage("");
  }

  function submitHandler(event) {
    event.preventDefault();
    if (message !== "") {
      sendMessage();
    } else if (file !== null) {
      sendFile();
    }
  }

  function sendMessage() {
    const payload = {
      action: "message",
      message,
    };
    props.wsref.current.send(JSON.stringify(payload));
    setMessage("");
  }

  function sendFile() {
    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     name: props.user,
    //     filename: file.name,
    //     filesize: 10,
    //     type: "file",
    //     time: "0015",
    //   },
    // ]);
    // setFile(null);
  }

  function mapMessages(message, prev) {
    let name = prev < 0 ? "" : props.messages[prev].username;
    return (
      <Message
        user={props.user}
        prev={name}
        {...message}
        key={message.dateTime}
      />
    );
  }

  return (
    <div className="chat">
      <div className="chat-container">
        {props.messages.map((message, i) => mapMessages(message, i - 1))}
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

          {file !== null ? (
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
