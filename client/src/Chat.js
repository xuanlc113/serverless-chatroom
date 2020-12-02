import React, { useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { IconSend, IconFile, IconX } from "@tabler/icons";
import axios from "axios";
import Message from "./Message";
import "./Chat.css";

export default function Chat(props) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
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

  async function sendFile() {
    setUploading(true);
    let posturl = `${process.env.API_GATEWAY_URL}/generateUploadUrl`;
    const res = await axios.post(
      posturl,
      {
        room: props.room,
        username: props.user,
        filename: file.name,
        filetype: file.type,
      },
      {
        onUploadProgress: function (progressEvent) {
          setUploadPercent(
            Math.floor((progressEvent.loaded * 100) / progressEvent.total)
          );
        },
      }
    );
    await axios.put(res.data, file, { headers: { "Content-Type": file.type } });
    setFile(null);
    setUploading(false);
    setUploadPercent(0);
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
              {uploading ? (
                <div className="message-file-upload-info">
                  <div className="progress-bar">
                    <span
                      style={{
                        width: `${uploadPercent}%`,
                      }}
                    />
                  </div>
                  <p>
                    {Math.floor(file.size * (uploadPercent / 100))}/{file.size}
                  </p>
                </div>
              ) : (
                <IconX
                  className="chat-icon close"
                  onClick={() => setFile(null)}
                />
              )}
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
