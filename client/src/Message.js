import React, { useState } from "react";
import { IconFile, IconDownload } from "@tabler/icons";
import moment from "moment";
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
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const current = 200;
  const percent = 42;

  function downloadFile() {
    setDownloaded(true);
    setDownloading(true);
  }

  return (
    <div className="message-file-container">
      <IconFile className="message-icon file" />
      <div class="message-file-info">
        <p className="message-filename">{props.filename}</p>
        {downloading ? (
          <div className="message-file-download-info">
            <div className="progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
            <p>
              {current}kb/{props.filesize}kb
            </p>
          </div>
        ) : (
          <p className="message-filesize">{props.filesize}kb</p>
        )}
      </div>
      {!downloaded && (
        <IconDownload
          className="message-icon download"
          onClick={downloadFile}
        />
      )}
    </div>
  );
}

function SentFileMessage(props) {
  return (
    <div className="message-file-container">
      <div class="message-file-info">
        <p className="message-filename">{props.filename}</p>
        <p className="message-filesize">{props.filesize}kb</p>
      </div>
    </div>
  );
}
