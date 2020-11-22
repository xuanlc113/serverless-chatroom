import React, { useState } from "react";
import { IconDownload } from "@tabler/icons";
import "./Message.css";

export default function Message(props) {
  function userMessage() {
    return (
      <div className="message-container user">
        <div className="message-bubble user">
          {props.prev != props.name && (
            <p className="message-name">{props.name} </p>
          )}
          {props.type == "text" ? (
            <p className="message-text">{props.message}</p>
          ) : (
            <SentFileMessage {...props} />
          )}
        </div>
      </div>
    );
  }

  function otherMessage() {
    return (
      <div className="message-container">
        <div className="message-bubble">
          {props.prev != props.name && (
            <p className="message-name">{props.name} </p>
          )}
          {props.type == "text" ? (
            <p className="message-text">{props.message}</p>
          ) : (
            <ReceivedFileMessage {...props} />
          )}
        </div>
      </div>
    );
  }

  return props.user == props.name ? userMessage() : otherMessage();
  // return (
  // <div
  //   className={"message-container " + (props.user == props.name && "user")}
  // >
  //   <div className={"message-pad " + (props.user == props.name && "user")}>
  //     <p className="message-name">{props.name} </p>
  //     {props.type == "text" ? (
  //       <p className="message-text">{props.message}</p>
  //     ) : (
  //       <FileMessage {...props} />
  //     )}
  //   </div>
  // </div>
  // );
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
