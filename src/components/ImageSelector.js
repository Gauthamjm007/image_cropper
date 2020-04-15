import React, { Component } from "react";
import ImageCropper from "./ImageCropper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Swal from "sweetalert2";
import Grid from "@material-ui/core/Grid";

export default class ImageSelector extends Component {
  state = {
    selectedImage: null,
    name: "No file chosen",
    extension: null,
    fileUrl: null,
  };

  getImageExt = (type) => {
    const parts = type.split("/");
    return parts[parts.length - 1];
  };

  handleImage = (event) => {
    var input = event.target.files[0];
    var inputType = input.type;

    if (inputType.includes("image")) {
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      var reader = new FileReader();
      var objUrl = _URL.createObjectURL(input);
      img.onload = () => {
        var width = img.width.toString();
        var height = img.height.toString();
        if (width === "1024" && height === "1024") {
          _URL.revokeObjectURL(objUrl);
          var ext = this.getImageExt(inputType);
          reader.onload = (e) => {
            const src = e.target.result;
            this.setState({
              selectedImage: input,
              name: input.name,
              extension: ext,
              fileUrl: src,
            });
          };

          reader.readAsDataURL(input);
        } else {
          Swal.fire(
            "Error Uploading Photo",
            "Please upload an Image of 1024 X 1024 size",
            "error"
          );
          this.setState({
            selectedImage: null,
            name: "No file chosen",
            extension: null,
            fileUrl: null,
          });
        }
      };

      img.src = objUrl;
    } else {
      Swal.fire("Error ", "You can upload only Images", "error");
    }
  };

  handleClick = (event) => {
    event.preventDefault();
    this.input.click(event);
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    return (
      <div>
        <div className="navbar">
          <div onClick={this.handleReload}>
            <Grid container spacing={3}>
              <Grid item xs={2}>
                <h2>Image 4 Cropper</h2>
              </Grid>
              <Grid item xs={2}>
                <img
                  src="https://i.ibb.co/r33Sw3D/crop.png"
                  alt="logo"
                  style={{ width: 30, height: 30 }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
        {this.state.name === "No file chosen" ? (
          <div className="upload-section">
            <input
              type="file"
              tabIndex="-1"
              className="hidden-input"
              onChange={this.handleImage}
              ref={(x) => (this.input = x)}
            ></input>
            <div className="input-cover" onClick={this.handleClick}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
              >
                Upload Image
              </Button>
            </div>
          </div>
        ) : (
          <ImageCropper url={this.state.fileUrl}></ImageCropper>
        )}
      </div>
    );
  }
}
