import React, { useState } from "react";
import "./Popup.css";

export default function Popup(props) {
    const [error, setError] = useState(false);

    const submitHandler = (event) => {
        event.preventDefault();
        if (props.username.length == 0) {
            setError(true);
        } else {
            props.setPopup(false);
        }
    }

    return (
        <div className="popup">
            <form className="popup-form" onSubmit={submitHandler}>
                <div className="popup-input-block">
                <input 
                    type="text" 
                    placeholder="Enter a name" 
                    value={props.username} 
                    onChange={(e) => props.setUsername(e.target.value)}
                    className={"popup-input" + (error ? " error": "")}
                />
                {error && <p className="popup-input-error">Name cannot be empty</p>}
                </div>
                <button className="popup-button">Go</button>
            </form>
        </div>
    )
}