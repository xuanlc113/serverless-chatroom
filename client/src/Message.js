import React, { useState } from "react";
import { IconDownload } from "@tabler/icons";
import "./Message.css";

export default function Message(props) {
  function userMessage() {
    return (
      <div className="message-container user">
        <div className="message-pad user">
          <p className="message-name">{props.name} </p>
          {props.type == "text" ? (
            <p className="message-text">{props.message}</p>
          ) : (
            <SentFileMessage />
          )}
        </div>
      </div>
    );
  }

  function otherMessage() {
    return (
      <div className="message-container">
        <div className="message-pad">
          <p className="message-name">{props.name} </p>
          {props.type == "text" ? (
            <p className="message-text">{props.message}</p>
          ) : (
            <ReceivedFileMessage />
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

function SentFileMessage(props) {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const current = 200;
  const percent = 42;

  const downloadFile = () => {
    setDownloaded(true);
    setDownloading(true);
  };
  return (
    <div className="message-file">
      <div class="message-file-info">
        <p className="message-filename">{props.filename}</p>
        {!downloading ? (
          <p className="message-filesize">{props.filesize}kb</p>
        ) : (
          <div className="message-file-download">
            <div className="progress-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
            <p>
              {current}kb/{props.filesize}kb
            </p>
          </div>
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

function ReceivedFileMessage(props) {
  return (
    <div className="message-file">
      <div class="message-file-info"></div>
    </div>
  );
}
