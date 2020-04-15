import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import CroppedImgPreview from "./ShowCropped";
import ImagePreview from "./ImagePreview";
import "react-image-crop/dist/ReactCrop.css";
import Button from "@material-ui/core/Button";

const uploadFile = async (file) => {
  let data = {
    tags: "browser_upload",
    file: file,
    upload_preset: "doc_codepen_example",
  };

  var url = "https://api.cloudinary.com/v1_1/demo/upload";
  const response = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data),
  });
  return response.json();
};

export default class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      src: null,
      cropSelection: {
        unit: "px",
        width: 755,
        height: 450,
        x: 0,
        y: 0,
        value: "755 x 450",
        name: "size1",
      },
      list: [
        {
          unit: "px",
          name: "size1",
          value: "755 x 450",
          width: 755,
          height: 450,
          x: 0,
          y: 0,
          url: null,
          clicked: true,
          isChecked: true,
        },
        {
          unit: "px",
          name: "size2",
          value: "365 x 450",
          width: 365,
          height: 450,
          x: 0,
          y: 0,
          url: null,
          clicked: false,
          isChecked: false,
        },
        {
          unit: "px",
          name: "size3",
          value: "365 x 212",
          width: 365,
          height: 212,
          x: 0,
          y: 0,
          url: null,
          clicked: false,
          isChecked: false,
        },
        {
          unit: "px",
          name: "size4",
          value: "380 x 380",
          width: 380,
          height: 380,
          x: 0,
          y: 0,
          url: null,
          clicked: false,
          isChecked: false,
        },
      ],
      active: "755 x 450",
      selectedType: "size1",
      showPreview: false,
      loading: false,
      loadSuccess: false,
      uploadAll: false,
      uploadList: [],
    };
  }
  componentDidMount = () => {
    this.onSelectFile();
  };

  static getDerivedStateFromProps = (nextProps, prevState) => {
    if (prevState.url !== nextProps.url) {
      return {
        src: nextProps.url,
      };
    }
  };

  onSelectFile = () => {
    this.setState({ src: this.props.url });
  };

  handleReload = () => {
    window.location.reload();
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    var input = { ...crop };
    this.makeClientCrop(input);
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ cropSelection: crop });
  };

  onResolutionChange = (event) => {
    event.preventDefault();
    var buttonName = event.target.name;
    var updatedCrop = {};
    var list = [...this.state.list];
    list.forEach((item) => {
      if (item.name === buttonName) {
        var width = parseInt(item.width);
        var height = parseInt(item.height);
        updatedCrop = {
          unit: "px",
          x: item.x,
          y: item.y,
          width: width,
          height: height,
          value: item.value,
          name: item.name,
        };
      }
    });
    this.onCropComplete(updatedCrop);
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );

      this.setState((state) => {
        for (let i = 0; i < state.list.length; i++) {
          if (state.list[i].value === crop.value) {
            state.list[i].x = crop.x;
            state.list[i].y = crop.y;
            state.list[i].url = croppedImageUrl;
            state.list[i].clicked = true;
            const list = [...state.list];
            return {
              cropSelection: crop,
              list: list,
              active: state.list[i].value,
              selectedType: state.list[i].name,
              croppedImageUrl: croppedImageUrl,
            };
          }
        }
      });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    var data = "";
    new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
      data = canvas.toDataURL();
    });

    return data;
  }

  togglePreviewScreen = (event) => {
    var toggle = !this.state.showPreview;
    this.setState({ showPreview: toggle });
  };

  handleSelectImage = (event) => {
    let selectedImage = event.target.name;
    var list = [...this.state.list];

    list.forEach((item) => {
      if (item.name === selectedImage) {
        item.isChecked = !item.isChecked;
      }
    });

    this.setState({ list: list });
  };

  uploadImages = async (event) => {
    var toggle = !this.state.uploadAll;
    var list = [...this.state.list];
    var uploadList = [];
    this.setState({ loading: true });
    for (let i = 0; i < list.length; i++) {
      if (list[i].isChecked) {
        let response = await uploadFile(list[i].url);
        if (response) {
          list[i].url = response.url;
          uploadList.push(list[i]);
        }
      }
    }

    this.setState({
      list: list,
      loading: false,
      loadSuccess: true,
      uploadAll: toggle,
      uploadList: uploadList,
    });
  };

  handleLoader = (event) => {
    this.setState({ loadSuccess: false });
  };

  returnButtonClass = (button) => {
    let buttonClass = "";
    if (this.state.active === button.value && button.clicked === true) {
      buttonClass = button.color + " clicked";
    } else if (this.state.active === button.value && button.clicked === false) {
      buttonClass = button.color;
    } else if (this.state.active !== button.value && button.clicked === true) {
      buttonClass = "clicked";
    }

    return buttonClass;
  };

  returnPreviewBtnClass = () => {
    let buttonClass = "";
    var list = [...this.state.list];

    list.forEach((item) => {
      if (item.value === this.state.active) {
        buttonClass = item.color;
      }
    });

    return "preview-button " + buttonClass;
  };

  render() {
    const {
      cropSelection,
      croppedImageUrl,
      src,
      list,
      uploadList,
    } = this.state;
    var checkCount = list.filter((item) => {
      return item.isChecked === true;
    });

    return (
      <div className="image-cropper">
        {!this.state.uploadAll && (
          <div className="preview-image">
            <ReactCrop
              src={src}
              crop={cropSelection}
              locked
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          </div>
        )}
        {!this.state.uploadAll && (
          <div className="button-group">
            {list.map((button, index) => {
              return (
                <div className="buttons" key={button.value}>
                  <input
                    type="button"
                    name={button.name}
                    className={this.returnButtonClass(button)}
                    value={button.value}
                    onClick={this.onResolutionChange}
                  />
                  <input
                    type="checkbox"
                    name={button.name}
                    defaultChecked={button.isChecked}
                    onClick={this.handleSelectImage}
                    disabled={!button.clicked}
                  ></input>
                </div>
              );
            })}

            <div className="button-row">
              <Button
                variant="contained"
                color="primary"
                disabled={checkCount.length < 1 ? true : false}
                onClick={this.uploadImages}
              >
                Upload Selected ({checkCount.length})
              </Button>
            </div>
          </div>
        )}
        {this.state.showPreview && (
          <CroppedImgPreview
            croppedImageUrl={croppedImageUrl}
            closePreview={this.togglePreviewScreen}
            resolution={this.state.active}
            selectionType={this.state.selectedType}
          ></CroppedImgPreview>
        )}
        {this.state.loading && (
          <div className="loader-screen">
            <div className="blur-screen"></div>
            <div className="cover">
              <div className="row">
                <p>Uploading {checkCount.length} cropped images to Cloud</p>
              </div>
            </div>
          </div>
        )}
        {this.state.loadSuccess && (
          <div className="loader-screen">
            <div className="blur-screen"></div>
            <div className="cover">
              <div className="row">
                <p>Uploaded Images Successfully</p>
              </div>
            </div>
          </div>
        )}

        {this.state.uploadAll && (
          <>
            <ImagePreview
              images={uploadList}
              handleLoader={this.handleLoader}
            ></ImagePreview>
            <br />
            <button onClick={this.handleReload}>Back</button>
          </>
        )}
      </div>
    );
  }
}
