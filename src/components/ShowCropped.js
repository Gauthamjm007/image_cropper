import React from "react";

export default function ShowCropped(props) {
  return (
    <div className="final-image">
      <div className="background-blur" onClick={props.closePreview}></div>
      <div className="cover">
        <div className="row">
          <p>
            {props.selectionType}
            {props.resolution}
          </p>
          <button className="close-btn" onClick={props.closePreview}>
            x
          </button>
        </div>
        <div className="row">
          <img
            alt="Crop"
            style={{ maxWidth: "100%" }}
            src={props.croppedImageUrl}
          />
        </div>
      </div>
    </div>
  );
}
