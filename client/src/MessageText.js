import React, { useState } from "react";
import { IconDownload } from '@tabler/icons';
import "./MessageText.css";

export default function MessageText(props) {

    return (
        <div className={"message-container " + (props.user == props.name ? "user" : "")}>
            <div className={"message-pad " + (props.user == props.name ? "user" : "")}>
                <p className="message-name">{props.name}</p>
                {props.type == "text" ?
                <p className="message-text">{props.message}</p>
                :
                <FileMessage {...props} />
                }
            </div>
        </div>
    )
}

function FileMessage(props) {
    const [downloaded, setDownloaded] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const current = 200;
    const percent = 42;

    const downloadFile = () => {
        setDownloaded(true);
        setDownloading(true);
    }
    return (
        <div className="message-file">
            <div class="message-file-info">
                <p className="message-filename">{props.filename}</p>
                {!downloading ?
                <p className="message-filesize">{props.filesize}kb</p>
                :
                <div className="message-file-download">
                    <div className="progress-bar" ><span style={{width: `${percent}%`}}/></div>
                    <p>{current}kb/{props.filesize}kb</p>
                </div>
                }
            </div>
            {!downloaded && <IconDownload className="message-icon download" onClick={downloadFile}/>}
        </div>
    )
}