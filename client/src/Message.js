import React from "react";
import { IconFile, IconExternalLink } from "@tabler/icons";
import moment from "moment";
import axios from "axios";
import "./Message.css";

export default function Message(props) {
  function convertTime() {
    return moment.unix(props.dateTime).format("hh:mma");
  }

  function userMessage() {
    return (
      <div className="message-container user">
        <div className="message-bubble user prev">
          <div className="message-content">
            {props.type === "text" ? (
              <p className="message-text">{props.message}</p>
            ) : (
              <SentFileMessage {...props} />
            )}
            <p className="message-time">{convertTime()}</p>
          </div>
        </div>
      </div>
    );
  }

  function otherMessage() {
    return (
      <div className="message-container">
        <div
          className={
            "message-bubble " + (props.prev === props.username && "prev")
          }
        >
          {props.prev !== props.username && (
            <p className="message-name">{props.username}</p>
          )}
          <div className="message-content">
            {props.type === "text" ? (
              <p className="message-text">{props.message}</p>
            ) : (
              <ReceivedFileMessage {...props} />
            )}
            <p className="message-time">{convertTime()}</p>
          </div>
        </div>
      </div>
    );
  }

  return props.user === props.username ? userMessage() : otherMessage();
}

function ReceivedFileMessage(props) {
  function convertBytes(bytes) {
    if (bytes > 999999) {
      bytes /= 1000000;
      return `${bytes.toFixed(2)}mb`;
    } else if (bytes > 999) {
      bytes /= 1000;
      return `${bytes.toFixed(2)}kb`;
    }
    return `${bytes}b`;
  }

  async function openFile() {
    let posturl = `${process.env.REACT_APP_API_GATEWAY_URL}/generateDownloadUrl`;
    const res = await axios.post(posturl, {
      room: props.room,
      username: props.username,
      id: props.id,
      filename: props.filename,
    });
    const link = document.createElement("a");
    link.href = res.data;
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
  }

  return (
    <div className="message-file-container">
      <IconFile className="message-icon file" />
      <div className="message-file-info">
        <p className="message-filename">{props.filename}</p>
        <p className="message-filesize">{convertBytes(props.filesize)}</p>
      </div>
      <IconExternalLink className="message-icon download" onClick={openFile} />
    </div>
  );
}

function SentFileMessage(props) {
  return (
    <div className="message-file-container">
      <IconFile className="message-icon file" />
      <div className="message-file-info">
        <p className="message-filename">{props.filename}</p>
        <p className="message-filesize">{props.filesize}kb</p>
      </div>
    </div>
  );
}
